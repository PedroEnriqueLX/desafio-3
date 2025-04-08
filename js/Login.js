document.addEventListener('DOMContentLoaded', () => {
    const botaoLogin = document.querySelector('#botao-login');
    const inputIdLogin = document.querySelector('#id-login');
    const inputSenhaLogin = document.querySelector('#senha-login');

    botaoLogin.addEventListener('click', () => {
        const dadosSalvos = JSON.parse(localStorage.getItem('dadosFormulario'));

        if (!dadosSalvos) {
            alert('Nenhum usuário encontrado. Por favor, inscreva-se primeiro.');
            return;
        }

        const idCriado = dadosSalvos.idLogin;
        const senhaCriada = dadosSalvos.senhaLogin;


        if (inputIdLogin.value == '' || inputSenhaLogin.value == '') {
            alert('ID ou Senha não podem estar vazios');
            return;
        } else {
            if (inputIdLogin.value !== idCriado) {
                alert('ID incorreto');
                return;
            }

            if (inputSenhaLogin.value !== senhaCriada) {
                alert('Senha incorreta');
                return;
            }
            alert('Login realizado com sucesso');
        }

    });
});