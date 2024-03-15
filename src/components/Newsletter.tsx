import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Newsletter.css';
import { postNews } from '../api/users/post-news.ts'; // Importe a função postNews do serviço de newsletter
import { Newsletter } from '../api/users/types/newsletter'; // Importe o tipo Newsletter

const News = () => {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const sendNewsletter = async () => {
    try {

      setLoading(true);
      const newsletterData: Newsletter = {
        subject: subject,
        body: content
      };

      // Chama a função postNews para enviar os dados
      const response = await postNews(newsletterData);
      
      // Verifica a resposta do serviço
      if (response && response.status === 200) {
        console.log('Newsletter enviada com sucesso!');
      } else {
        console.error('Falha ao enviar a newsletter.');
      }
    } catch (error) {
      console.error('Erro ao enviar a newsletter:', error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-container">
      <h2>Newsletter Editor</h2>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={handleSubjectChange}
        className="subject-input"
      />
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        className="react-quill-container"
        style={{ height: '350px', marginBottom: '20px', overflowY: 'auto' }}
      />
      <button onClick={sendNewsletter} className="send-button" disabled={loading}>
        {loading ? 'Sending...' : 'Send Newsletter'}
      </button>
    </div>
  );
};

export default News;
