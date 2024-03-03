package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"text/template"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres" // Modificado para usar PostgreSQL
)

type RecaptchaResponse struct {
	Success    bool     `json:"success"`
	ErrorCodes []string `json:"error-codes"`
}
type Usuario struct {
	ID         uint      `gorm:"primary_key"`
	Nome       string    `form:"nome"`
	Email      string    `form:"email"`
	Subscribed int       `json:"subscribed"`
	DataHora   time.Time `json:"data_hora"`
	Recaptcha  string    `form:"g-recaptcha-response"`
	CodRec     string    `form:"codRec"`
	GerouCert  int       `json:"gerou_cert"`
}

type Recomendacao struct {
	gorm.Model
	Nome          string
	Email         string `gorm:"unique;not null"`
	ReferenceCode string
}

var (
	SMTPSERVER    = os.Getenv("SMTPSERVER")
	SMTPPORT      = os.Getenv("SMTPPORT")
	SMTPUSER      = os.Getenv("SMTPUSER")
	SMTPPASS      = os.Getenv("SMTPPASS")
	CAPTCHASECRET = os.Getenv("CAPTCHASECRET")
	DSN           = os.Getenv("DSN")
	SITE          = os.Getenv("SITE")
)

func sendEmail(name, from, to, subject, body string) error {
	auth := smtp.PlainAuth("", SMTPUSER, SMTPPASS, SMTPSERVER)
	// Ler o conteúdo do template HTML
	templateContent, err := ioutil.ReadFile("templates/boasvindas.html")
	if err != nil {
		return err
	}
	data := struct {
		Nome  string
		Email string
		Site  string
	}{
		Nome:  name,
		Email: to,
		Site:  SITE,
	}
	bodyMail := new(bytes.Buffer)
	tmpl := template.Must(template.New("bemvindo").Parse(string(templateContent)))
	err = tmpl.Execute(bodyMail, data)
	if err != nil {
		return err
	}

	msg := []byte("To: " + to + "\r\n" +
		"From: " + from + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=\"utf-8\"\r\n" +
		"\r\n" +
		bodyMail.String() + "\r\n")

	err = smtp.SendMail(SMTPSERVER+":"+SMTPPORT, auth, from, []string{to}, msg)
	if err != nil {
		return err
	}
	return nil
}

func validateEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func validateRecaptcha(response string) bool {
	// Montando o corpo da requisição
	body := fmt.Sprintf("secret=%s&response=%s", CAPTCHASECRET, response)

	// Criando uma requisição POST
	url := "https://www.google.com/recaptcha/api/siteverify"
	req, err := http.NewRequest("POST", url, bytes.NewBufferString(body))
	if err != nil {
		log.Println("Erro ao criar a requisição:", err)
		return false
	}

	// Definindo o cabeçalho da requisição
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Realizando a chamada HTTP
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Erro ao fazer a chamada HTTP:", err)
		return false
	}
	defer resp.Body.Close()

	// Decodificando a resposta JSON
	var recaptchaResponse RecaptchaResponse
	err = json.NewDecoder(resp.Body).Decode(&recaptchaResponse)
	if err != nil {
		log.Println("Erro ao decodificar a resposta JSON:", err)
		return false
	}

	// Validando a resposta
	if recaptchaResponse.Success {
		return true
	} else {
		log.Println("reCAPTCHA inválido!")
		log.Println(recaptchaResponse)
		return false
	}
}

func gerarUUID() string {
	return uuid.NewString()
}

func main() {
	logFile, err := os.OpenFile("guerraacademy.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println("Erro ao abrir o arquivo de log:", err)
		return
	}
	defer logFile.Close()
	log.SetOutput(logFile)

	// Configuração do roteador do Gin
	router := gin.Default()

	router.Static("/static", "./templates")

	router.Use(corsMiddleware())
	// Conexão com o banco de dados SQLite usando o GORM
	db, err := gorm.Open("postgres", DSN)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Migração automática para criar as tabelas de Usuários e Recomendacoes
	db.AutoMigrate(&Usuario{}, &Recomendacao{})

	router.LoadHTMLGlob("templates/*.html")
	// Configuração para servir arquivos estáticos

	// Função para renderizar o PDF a partir de um template

	//ROTA Get para abrir home
	router.GET("/", func(c *gin.Context) {
		// Recupera o valor do parâmetro "codRec" da consulta
		codRec := c.DefaultQuery("codRec", "N/A")
		log.Println("code Recomendation: " + codRec)
		// Renderiza o template "index.html" com codRec preenchido
		c.HTML(http.StatusOK, "index.html", gin.H{
			"CodRec": codRec,
		})
	})

	//Rota GET para o form de recomendacao

	router.GET("/recomendacao", func(c *gin.Context) {
		// Renderize o formulário HTML
		log.Println("render do form...")
		//tmpl, err := template.ParseFiles("templates/recomendacao.html")
		url := c.Request.URL.String()

		if err != nil {
			c.String(http.StatusInternalServerError, "Erro ao carregar o template")
			return
		}

		c.HTML(http.StatusOK, "recomendacao.html", gin.H{
			"url": url,
		})

	})

	//ROTA POST para receber dados do form

	router.POST("/recomendacao", func(c *gin.Context) {
		nome := c.PostForm("nome")
		email := c.PostForm("email")

		// Verifique se o email já está no banco de dados
		var recom Recomendacao
		err := db.Where("email = ?", email).First(&recom).Error
		if gorm.IsRecordNotFoundError(err) {
			// Email não encontrado, gere um novo UUID como reference_code
			referenceCode := gerarUUID()

			// Insira os dados no banco de dados
			newRecom := Recomendacao{
				Nome:          nome,
				Email:         email,
				ReferenceCode: referenceCode,
			}
			db.Create(&newRecom)

			// Retorne o link de recomendação gerado
			link := fmt.Sprintf("https://"+SITE+"/?codRec=%s#cadastro", referenceCode)
			c.String(http.StatusOK, "%s", link)
		} else if err == nil {
			// Email encontrado, retorne o UUID existente
			link := fmt.Sprintf("https://"+SITE+"/?codRec=%s#cadastro", recom.ReferenceCode)
			c.String(http.StatusOK, "%s", link)
		} else {
			c.String(http.StatusInternalServerError, "Erro ao consultar o banco de dados")
		}
	})

	// Rota para receber os dados do formulário
	router.POST("/adicionar", func(c *gin.Context) {
		var usuario Usuario
		now := time.Now()

		// Obtém os dados do formulário usando ShouldBindWith e o tipo "form"
		if err := c.ShouldBind(&usuario); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !validateEmail(usuario.Email) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email inválido"})
			return
		}

		if !validateRecaptcha(usuario.Recaptcha) {
			log.Println("Recaptcha response:" + usuario.Recaptcha)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Recaptcha inválido"})
			return
		}

		// Define o horário de registro
		usuario.DataHora = now
		usuario.Subscribed = 1

		//insere ou atualiza
		if db.Model(&usuario).Where("email = ?", usuario.Email).Updates(&usuario).RowsAffected == 0 {
			db.Create(&usuario)
			emailBody := "Olá " + usuario.Nome + ", bem-vindo à Guerra Academy!"
			err = sendEmail(usuario.Nome, "noreply@guerra.academy", usuario.Email, "Bem-vindo à Guerra Academy", emailBody)
			if err != nil {
				log.Println("Erro ao enviar email: " + err.Error())
			}
		}

		if err != nil {
			println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao enviar o e-mail de boas-vindas"})
			return
		}

		// Carregando o template HTML
		tmpl, err := template.ParseFiles("templates/sucesso.html")
		// Renderizando o template
		var data struct{}
		err = tmpl.Execute(c.Writer, data)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	})

	// Rota para cancelar a inscrição do usuário
	router.GET("/unsubscribe", func(c *gin.Context) {
		email := c.Query("email")

		var usuario Usuario
		if err := db.Where("email = ?", email).First(&usuario).Error; err != nil {

			c.JSON(http.StatusBadRequest, gin.H{"error": "Usuário não encontrado", "email": email, "err": err.Error()})
			return
		}

		usuario.Subscribed = 0
		usuario.DataHora = time.Now()

		if err := db.Save(&usuario).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao cancelar inscrição"})
			return
		}
		// Carregando o template HTML
		tmpl, err := template.ParseFiles("templates/unsubscribed.html")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Renderizando o template
		var data struct{}
		err = tmpl.Execute(c.Writer, data)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		//c.JSON(http.StatusOK, gin.H{"message": "Inscrição cancelada com sucesso"})
	})

	// Inicia o servidor HTTP
	router.Run(":8000")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
