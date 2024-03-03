// form-validation.js

function validateForm(event) {
    const form = event.target;

    const emailInput = form.querySelector('#email');
    const nomeInput = form.querySelector('#nome');

    const isEmailValid = validateEmail(emailInput.value);
    const isNomeValid = validateNome(nomeInput.value);

    if (!isEmailValid) {
        alert('Por favor, insira um email válido.');
        event.preventDefault();
    }

    if (!isNomeValid) {
        alert('Por favor, insira um nome válido.');
        event.preventDefault();
    }
}

function validateEmail(email) {
    // Lógica de validação do email aqui
    return true; // Retorne true se for válido, false se não for
}

function validateNome(nome) {
    // Lógica de validação do nome aqui
    return nome.length > 0;
}
