document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.envio');
    const OpcoesTrilhas = document.querySelectorAll('.trilha__option');
    const trilhaRadios = document.querySelectorAll('.trilha__option input[type="radio"]');
    const checkbox = document.querySelector('#checkbox');
    const campoEmail = document.querySelector('#email');
    const campoNascimento = document.querySelector('#data-nascimento');
    const campoCPF = document.querySelector('#cpf');
    const campoTelefone = document.querySelector('#telefone');
    const campoUF = document.querySelector('#UF');
    const divEnviarDocumento = document.querySelectorAll('.arquivo__caixa');
    const botaoSalvar = document.querySelector('#salvar__Infos');
    const exibirDadosDiv = document.querySelector('#exibir-dados');

    // Função para preencher o formulário com os dados salvos
    function preencherFormulario() {
        const dadosSalvos = JSON.parse(localStorage.getItem('dadosFormulario'));
        if (dadosSalvos) {
            document.querySelector('#nome').value = dadosSalvos.nome || '';
            campoEmail.value = dadosSalvos.email || '';
            campoNascimento.value = dadosSalvos.dataNascimento || '';
            campoCPF.value = dadosSalvos.cpf || '';
            campoTelefone.value = dadosSalvos.telefone || '';
            document.querySelector('#cep').value = dadosSalvos.cep || '';
            document.querySelector('#endereço').value = dadosSalvos.endereco || '';
            document.querySelector('#bairro').value = dadosSalvos.bairro || '';
            document.querySelector('#numero-da-casa').value = dadosSalvos.numero || '';
            document.querySelector('#complemento').value = dadosSalvos.complemento || '';
            document.querySelector('#cidade').value = dadosSalvos.cidade || '';
            campoUF.value = dadosSalvos.uf || '';
            checkbox.checked = dadosSalvos.termosAceitos || false;

            // Preenche o campo de seleção de sexo
            const campoSexo = document.querySelector('#opcoes');
            if (campoSexo) {
                campoSexo.value = dadosSalvos.sexo || ''; // Define o valor salvo no campo de seleção
            }

            // Seleciona a trilha salva
            OpcoesTrilhas.forEach(opcao => {
                const textoTrilha = opcao.querySelector('h4')?.textContent || '';
                const inputRadio = opcao.querySelector('input[type="radio"]'); // Seleciona o input do tipo radio
                if (textoTrilha === dadosSalvos.trilha) {
                    opcao.classList.add('selecionado'); // Marca a trilha como selecionada
                    if (inputRadio) {
                        inputRadio.checked = true; // Marca o input como "checked"
                    }
                } else {
                    opcao.classList.remove('selecionado'); // Remove a seleção de outras trilhas
                    if (inputRadio) {
                        inputRadio.checked = false; // Garante que outros inputs não estejam marcados
                    }
                }
            });
        }
    }

    // Abre o seletor de arquivos para o usuário upar os documentos
    divEnviarDocumento.forEach((arquivoCaixa) => {
        const inputFile = arquivoCaixa.querySelector('input[type="file"]');
        arquivoCaixa.addEventListener('click', () => {
            inputFile.click();
        });

        // Lida com o arquivo selecionado
        inputFile.addEventListener('change', (event) => {
            const arquivoSelecionado = event.target.files[0];
            if (arquivoSelecionado) {
                const textoArquivo = arquivoCaixa.querySelector('.texto__arquivo');
                textoArquivo.textContent = `Arquivo selecionado: ${arquivoSelecionado.name}`;
            }
        });
    });

    // Restringe números em campos específicos
    document.querySelectorAll('#nome, #cidade, #UF').forEach((campo) => {
        campo.addEventListener('input', (event) => {
            campo.value = campo.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
        });
    });

    // Validação do campo UF para aceitar apenas dois caracteres
    campoUF.addEventListener('input', () => {
        campoUF.value = campoUF.value.toUpperCase().slice(0, 2);
    });

    // Adiciona funcionalidade às opções de trilhas
    OpcoesTrilhas.forEach(opcao => {
        opcao.addEventListener('click', () => {
            OpcoesTrilhas.forEach(op => op.classList.remove('selecionado'));

            opcao.classList.add('selecionado');
        });
    });

    // Função para exibir mensagem de erro
    function mostrarError(campo, messagem) {
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
        evento.preventDefault(); // Impede o envio do formulário
        limparErrors();

        let Valido = true;

        const emailFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailFormato.test(campoEmail.value)) {
            mostrarError(campoEmail, 'Por favor, insira um email válido.');
            Valido = false;
        }

        const dataFormato = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dataFormato.test(campoNascimento.value)) {
            mostrarError(campoNascimento, 'A data de nascimento é inválida, deve estar no formato DD/MM/AAAA.');
            Valido = false;
        } else {
            const [dia, mes, ano] = campoNascimento.value.split('/').map(Number);
            const data = new Date(ano, mes - 1, dia); // O mês no objeto Date é baseado em zero (0 = janeiro, 11 = dezembro)

            // Verifica se a data é válida
            if (
                data.getDate() !== dia || 
                data.getMonth() !== mes - 1 || 
                data.getFullYear() !== ano
            ) {
                mostrarError(campoNascimento, 'A data de nascimento é inválida.');
                Valido = false;
            } else {
                // Verifica se o ano está dentro de um intervalo aceitável (ex.: maior que 1900 e menor que o ano atual)
                const anoAtual = new Date().getFullYear();
                if (ano < 1900 || ano > anoAtual) {
                    mostrarError(campoNascimento, `O ano de nascimento deve estar entre 1900 e ${anoAtual}.`);
                    Valido = false;
                }
            }
        }

        const cpfFormato = /^\d{11}$/;
        if (!cpfFormato.test(campoCPF.value)) {
            mostrarError(campoCPF, 'O CPF deve conter exatamente 11 dígitos.');
            Valido = false;
        }

        const celularFormato = /^\d{10,11}$/;
        if (!celularFormato.test(campoTelefone.value)) {
            mostrarError(campoTelefone, 'O telefone deve conter 10 ou 11 dígitos.');
            Valido = false;
        }

         // Verifica se os arquivos foram selecionados
         let arquivosValidos = true;
         divEnviarDocumento.forEach((div, index) => {
             const inputFile = div.querySelector('input[type="file"]');
             if (!inputFile?.files[0]) {
                 arquivosValidos = false;
                 Valido = false;
                 const mensagem = index === 0
                     ? 'Por favor, envie o Documento de Identidade.'
                     : 'Por favor, envie o Comprovante de Residência.';
                 alert(mensagem);
             }
         });
 
         if (!arquivosValidos) {
             return; // Interrompe o processo se os arquivos não forem válidos
         }

        const trilhaSelecionada = Array.from(trilhaRadios).some((radio) => radio.checked);
        if (!trilhaSelecionada) {
            const trilhaContainer = trilhaRadios[0].closest('.formulario__trilhas');
            mostrarError(trilhaContainer, 'Você deve selecionar uma trilha.');
            Valido = false;
        }

        if (!checkbox.checked) {
            mostrarError(checkbox, 'Você deve aceitar os Termos e Condições.');
            Valido = false;
        }

        if (Valido) {
            alert('Inscrição realizada com sucesso!');
        }
    });

    // Função para salvar os dados no LocalStorage
    botaoSalvar.addEventListener('click', () => {
        if (!document.querySelector('#nome').value.trim() ||
            !campoEmail.value.trim() ||
            !campoNascimento.value.trim() ||
            !campoCPF.value.trim() ||
            !campoTelefone.value.trim() ||
            !document.querySelector('#cep').value.trim() ||
            !document.querySelector('#endereço').value.trim() ||
            !document.querySelector('#cidade').value.trim() ||
            !campoUF.value.trim()) {
            alert('Por favor, preencha todos os campos antes de salvar.');
            return;
        }

        // Verifica se os arquivos foram selecionados
        let arquivosValidos = true;
        divEnviarDocumento.forEach((div, index) => {
            const inputFile = div.querySelector('input[type="file"]');
            if (!inputFile?.files[0]) {
                arquivosValidos = false;
                const mensagem = index === 0
                    ? 'Por favor, envie o Documento de Identidade.'
                    : 'Por favor, envie o Comprovante de Residência.';
                alert(mensagem);
            }
        });

        if (!arquivosValidos) {
            return; // Interrompe o processo se os arquivos não forem válidos
        }

        // Pega o nome da trilha selecionada
        const trilhaSelecionada = Array.from(OpcoesTrilhas).find(opcao => opcao.classList.contains('selecionado'));
        const textoTrilha = trilhaSelecionada?.querySelector('h4')?.textContent || 'Nenhuma trilha selecionada';

        // Pega o sexo selecionado no <select>
        const sexoSelecionado = document.querySelector('#opcoes').value;

        // Pega os nomes dos arquivos anexados
        const arquivosAnexados = Array.from(divEnviarDocumento).map((div, index) => {
            const inputFile = div.querySelector('input[type="file"]');
            const nomeArquivo = inputFile?.files[0]?.name || 'Nenhum arquivo selecionado';
            return index === 0
                ? `Documento de identidade: ${nomeArquivo}`
                : `Comprovante de residência: ${nomeArquivo}`;
        });

        const dadosFormulario = {
            nome: document.querySelector('#nome')?.value || '',
            email: campoEmail.value,
            dataNascimento: campoNascimento.value,
            cpf: campoCPF.value,
            telefone: campoTelefone.value,
            sexo: sexoSelecionado,
            cep: document.querySelector('#cep')?.value || '',
            endereco: document.querySelector('#endereço')?.value || '',
            bairro: document.querySelector('#bairro')?.value || '',
            numero: document.querySelector('#numero-da-casa')?.value || '',
            complemento: document.querySelector('#complemento')?.value || '',
            cidade: document.querySelector('#cidade')?.value || '',
            uf: campoUF.value,
            trilha: textoTrilha,
            arquivos: arquivosAnexados,
            termosAceitos: checkbox.checked
        };

        // Armazena os dados no LocalStorage
        localStorage.setItem('dadosFormulario', JSON.stringify(dadosFormulario));

        // Redireciona para a página de exibição dos dados
        window.location.href = './dadosSalvos.html';
    });

    // Preenche o formulário com os dados salvos ao carregar a página
    preencherFormulario();
});