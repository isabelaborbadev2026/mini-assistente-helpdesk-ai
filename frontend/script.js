const pergunta = document.getElementById("pergunta");
const botao = document.getElementById("btnEnviar");
const chatMensagens = document.getElementById("chatMensagens");
const formPergunta = document.getElementById("formPergunta");
const telaInicial = document.getElementById("telaInicial");
const novaConversa = document.getElementById("novaConversa");
const listaConversas = document.getElementById("listaConversas");


// =========================
// ENVIAR PERGUNTA
// =========================

formPergunta.addEventListener("submit", enviarPergunta);


async function enviarPergunta(event) {

    event.preventDefault();

    const textoPergunta = pergunta.value.trim();


    // Não envia pergunta vazia

    if (textoPergunta === "") {
        return;
    }


    // Esconde a tela inicial

    if (telaInicial) {
        telaInicial.style.display = "none";
    }


    // Mostra pergunta do usuário

    adicionarMensagem(
        textoPergunta,
        "usuario"
    );


    // Adiciona ao histórico

    adicionarAoHistorico(
        textoPergunta
    );


    // Limpa campo

    pergunta.value = "";

    pergunta.style.height = "auto";


    // Desativa botão

    botao.disabled = true;

    botao.innerText = "…";


    // Mostra "Pensando..."

    const mensagemPensando =
        adicionarMensagem(
            "Pensando...",
            "ia"
        );


    try {

        // =========================
        // CHAMADA PARA O BACKEND
        // =========================

        const respostaApi =
            await fetch(
                "http://localhost:3000/pergunta",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        pergunta:
                            textoPergunta
                    })
                }
            );


        // Verifica erro

        if (!respostaApi.ok) {

            throw new Error(
                "Erro ao obter resposta do servidor."
            );
        }


        // Converte resposta

        const dados =
            await respostaApi.json();


        // Mostra resposta da IA

        mensagemPensando.innerText =
            dados.resposta;


    } catch (erro) {

        console.error(erro);


        mensagemPensando.innerText =
            "Erro ao conectar com o servidor. Tente novamente.";


    } finally {

        // Reativa botão

        botao.disabled = false;

        botao.innerText = "↑";


        // Volta foco para o campo

        pergunta.focus();
    }
}



// =========================
// ADICIONAR MENSAGEM
// =========================

function adicionarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.createElement("div");


    mensagem.classList.add(
        "mensagem",
        tipo
    );


    // =========================
    // AVATAR
    // =========================

    const avatar =
        document.createElement("div");


    avatar.classList.add(
        "avatar-mensagem"
    );


    if (tipo === "ia") {

        avatar.innerText = "✦";

    } else {

        avatar.innerText = "Você";
    }


    // =========================
    // CONTEÚDO
    // =========================

    const conteudo =
        document.createElement("div");


    conteudo.classList.add(
        "conteudo"
    );


    conteudo.innerText =
        texto;


    // =========================
    // MONTA MENSAGEM
    // =========================

    mensagem.appendChild(
        avatar
    );

    mensagem.appendChild(
        conteudo
    );


    chatMensagens.appendChild(
        mensagem
    );


    // =========================
    // ROLAGEM AUTOMÁTICA
    // =========================

    chatMensagens.scrollTop =
        chatMensagens.scrollHeight;


    return conteudo;
}



// =========================
// NOVA CONVERSA
// =========================

novaConversa.addEventListener(
    "click",
    function () {

        // Limpa mensagens

        chatMensagens.innerHTML = "";


        // Cria tela inicial

        const novaTelaInicial =
            document.createElement(
                "div"
            );


        novaTelaInicial.id =
            "telaInicial";


        novaTelaInicial.classList.add(
            "welcome"
        );


        novaTelaInicial.innerHTML = `

            <div class="welcome-icon">
                ✦
            </div>

            <h2>
                Como posso ajudar?
            </h2>

            <p>
                Faça uma pergunta e converse
                com seu assistente de IA.
            </p>

            <div class="sugestoes">

                <button class="sugestao">
                    💡 Explique o que é JavaScript
                </button>

                <button class="sugestao">
                    💻 O que é uma API?
                </button>

                <button class="sugestao">
                    🚀 O que é Node.js?
                </button>

            </div>

        `;


        chatMensagens.appendChild(
            novaTelaInicial
        );


        // Limpa campo

        pergunta.value = "";

        pergunta.style.height =
            "auto";


        pergunta.focus();
    }
);



// =========================
// BOTÕES DE SUGESTÃO
// =========================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "sugestao"
            )
        ) {

            let texto =
                event.target.innerText;


            // Remove emojis

            texto = texto
                .replace("💡 ", "")
                .replace("💻 ", "")
                .replace("🚀 ", "");


            pergunta.value =
                texto;


            pergunta.focus();


            // Ajusta textarea

            pergunta.style.height =
                "auto";


            pergunta.style.height =
                Math.min(
                    pergunta.scrollHeight,
                    150
                ) + "px";
        }
    }
);



// =========================
// ENTER PARA ENVIAR
// =========================

pergunta.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();


            formPergunta.requestSubmit();
        }
    }
);



// =========================
// TEXTAREA AUTOMÁTICO
// =========================

pergunta.addEventListener(
    "input",
    function () {

        // Reseta altura

        pergunta.style.height =
            "auto";


        // Ajusta altura

        pergunta.style.height =
            Math.min(
                pergunta.scrollHeight,
                150
            ) + "px";
    }
);



// =========================
// ADICIONAR AO HISTÓRICO
// =========================

function adicionarAoHistorico(
    texto
) {

    const item =
        document.createElement(
            "button"
        );


    item.classList.add(
        "item-conversa"
    );


    // =========================
    // ÍCONE
    // =========================

    const icone =
        document.createElement(
            "span"
        );


    icone.classList.add(
        "icone-conversa"
    );


    icone.innerText = "💬";


    // =========================
    // TÍTULO
    // =========================

    const titulo =
        document.createElement(
            "span"
        );


    titulo.classList.add(
        "titulo-conversa"
    );


    titulo.innerText =
        texto;


    // =========================
    // MONTA ITEM
    // =========================

    item.appendChild(
        icone
    );


    item.appendChild(
        titulo
    );


    // Coloca no início

    listaConversas.prepend(
        item
    );
}