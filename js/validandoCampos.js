document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.formulario');
    const trilhaRadios = document.querySelectorAll('input[name="curso"]');
    const checkbox = document.querySelector('#checkbox');
    const campoEmail = document.querySelector('#email');
    const campoNascimento = document.querySelector('#data-nascimento');
    const campoCPF = document.querySelector('#cpf');
    const campoTelefone = document.querySelector('#telefone');
    const campoUF = document.querySelector('#UF');

    // Restringe números em campos específicos
    document.querySelectorAll('#nome, #cidade, #UF').forEach((campo) => {
        campo.addEventListener('input', (event) => {
            // Remove números e caracteres especiais, permitindo apenas letras e espaços
            campo.value = campo.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
        });
    });

    // Validação do campo UF para aceitar apenas dois caracteres
    campoUF.addEventListener('input', () => {
        campoUF.value = campoUF.value.toUpperCase().slice(0, 2);
    });

    // Função para exibir mensagem de erro
    function mostrarError(campo, messagem) {
        // Remove mensagem de erro anterior, se existir
        let errorElemento = campo.parentNode.querySelector('.error-messagem');
        if (errorElemento) {
            errorElemento.remove();
        }

        errorElemento = alert(messagem);
    }

    // Função para limpar todas as mensagens de erro
    function limparErrors() {
        const errorElementos = document.querySelectorAll('.error-messagem');
        errorElementos.forEach((error) => error.remove());
    }

    // Função para validar o formulário
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        limparErrors();

        let Valido = true;

        // Validação do campo EMAIL
        const emailFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailFormato.test(campoEmail.value)) {
            mostrarError(campoEmail, 'Por favor, insira um email válido.');
            Valido = false;
        }

        // Validação do campo Data de Nascimento
        const dataFormato = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dataFormato.test(campoNascimento.value)) {
            mostrarError(campoNascimento, 'A data de nascimento invalida');
            Valido = false;
        }

        // Validação do campo CPF
        const cpfFormato = /^\d{11}$/;
        if (!cpfFormato.test(campoCPF.value)) {
            mostrarError(campoCPF, 'O CPF deve conter exatamente 11 dígitos.');
            Valido = false;
        }

        // Validação do campo Telefone
        const celularFormato = /^\d{10,11}$/;
        if (!celularFormato.test(campoTelefone.value)) {
            mostrarError(campoTelefone, 'O telefone deve conter 10 ou 11 dígitos.');
            Valido = false;
        }

        // Validação do checkbox
        if (!checkbox.checked) {
            mostrarError(checkbox, 'Você deve aceitar os Termos e Condições.');
            Valido = false;
        }

        if (Valido) {
            alert('Inscrição realizada com sucesso!');
            formulario.submit();
        }
    });
});