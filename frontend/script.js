const pergunta = document.getElementById("pergunta");
const botao = document.getElementById("btnEnviar");
const chatMensagens = document.getElementById("chatMensagens");
const formPergunta = document.getElementById("formPergunta");
const novaConversa = document.getElementById("novaConversa");
const listaConversas = document.getElementById("listaConversas");


// =========================
// VERIFICAR ELEMENTOS
// =========================

console.log("pergunta:", pergunta);
console.log("botao:", botao);
console.log("chatMensagens:", chatMensagens);
console.log("formPergunta:", formPergunta);


// =========================
// ENVIAR PERGUNTA
// =========================

formPergunta.addEventListener("submit", enviarPergunta);


async function enviarPergunta(event) {

    event.preventDefault();

    console.log("FORMULÁRIO FOI ENVIADO");

    const textoPergunta = pergunta.value.trim();

    console.log("Pergunta:", textoPergunta);

    if (textoPergunta === "") {
        return;
    }

    const telaInicial =
        document.getElementById("telaInicial");

    if (telaInicial) {
        telaInicial.remove();
    }

    adicionarMensagem(
        textoPergunta,
        "usuario"
    );

    adicionarAoHistorico(
        textoPergunta
    );

    pergunta.value = "";

    pergunta.style.height = "auto";

    botao.disabled = true;

    botao.innerText = "…";

    const mensagemPensando =
        adicionarMensagem(
            "Pensando...",
            "ia"
        );


    try {

        console.log(
            "Enviando para o backend..."
        );

        const token = localStorage.getItem("token");

        const respostaApi =
            await fetch(
                "http://localhost:3000/api/pergunta",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        pergunta:
                            textoPergunta
                    })
                }
            );

        // =========================
        // TOKEN EXPIRADO OU INVÁLIDO
        // =========================

        if (respostaApi.status === 401 || respostaApi.status === 403) {

            localStorage.removeItem("token");

            verificarLogin();

            throw new Error("Sua sessão expirou. Faça login novamente.");

        }

        console.log(
            "Status do servidor:",
            respostaApi.status
        );

        if (!respostaApi.ok) {

            throw new Error(
                "Erro ao obter resposta do servidor."
            );

        }

        const dados =
            await respostaApi.json();

        console.log(
            "Resposta recebida:",
            dados.resposta
        );

        if (!dados.resposta) {

            throw new Error(
                "O servidor não retornou uma resposta."
            );

        }

        if (
            typeof marked !== "undefined"
        ) {

            mensagemPensando.innerHTML =
                marked.parse(
                    dados.resposta
                );

        } else {

            mensagemPensando.innerText =
                dados.resposta;

        }

        console.log(
            "RESPOSTA COLOCADA NA TELA"
        );

        rolarParaBaixo();


    } catch (erro) {

        console.error(
            "ERRO NO FRONTEND:",
            erro
        );

        mensagemPensando.innerText =
            erro.message || "Erro ao conectar com o servidor. Tente novamente.";


    } finally {

        botao.disabled = false;

        botao.innerText = "↑";

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

    const conteudo =
        document.createElement("div");

    conteudo.classList.add(
        "conteudo"
    );

    conteudo.innerText =
        texto;

    mensagem.appendChild(
        avatar
    );

    mensagem.appendChild(
        conteudo
    );

    chatMensagens.appendChild(
        mensagem
    );

    rolarParaBaixo();

    return conteudo;
}


// =========================
// NOVA CONVERSA
// =========================

novaConversa.addEventListener(
    "click",
    function () {

        chatMensagens.innerHTML = "";

        const tela =
            document.createElement("div");

        tela.id =
            "telaInicial";

        tela.classList.add(
            "welcome"
        );

        tela.innerHTML = `

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

                <button
                    class="sugestao"
                    type="button"
                >
                    💡 Explique o que é JavaScript
                </button>

                <button
                    class="sugestao"
                    type="button"
                >
                    💻 O que é uma API?
                </button>

                <button
                    class="sugestao"
                    type="button"
                >
                    🚀 O que é Node.js?
                </button>

            </div>

        `;

        chatMensagens.appendChild(
            tela
        );

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

            texto = texto
                .replace("💡 ", "")
                .replace("💻 ", "")
                .replace("🚀 ", "");

            pergunta.value =
                texto;

            pergunta.focus();

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

        pergunta.style.height =
            "auto";

        pergunta.style.height =
            Math.min(
                pergunta.scrollHeight,
                150
            ) + "px";

    }
);


// =========================
// HISTÓRICO
// =========================

function adicionarAoHistorico(
    texto
) {

    const item =
        document.createElement("button");

    item.type = "button";

    item.classList.add(
        "item-conversa"
    );

    const icone =
        document.createElement("span");

    icone.classList.add(
        "icone-conversa"
    );

    icone.innerText =
        "💬";

    const titulo =
        document.createElement("span");

    titulo.classList.add(
        "titulo-conversa"
    );

    titulo.innerText =
        texto;

    item.appendChild(
        icone
    );

    item.appendChild(
        titulo
    );

    listaConversas.prepend(
        item
    );

}


// =========================
// SCROLL
// =========================

function rolarParaBaixo() {

    chatMensagens.scrollTo({

        top:
            chatMensagens.scrollHeight,

        behavior:
            "smooth"

    });

}


// =========================
// FUNÇÕES DE API DE AUTENTICAÇÃO
// =========================

async function fazerLogin(email, senha) {
  const resp = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const data = await resp.json();
  if (resp.ok) {
    localStorage.setItem('token', data.token);
  }
  return data;
}


// =========================
// LOGIN E CADASTRO
// =========================

const telaLogin = document.getElementById("telaLogin");
const telaCadastro = document.getElementById("telaCadastro");
const appPrincipal = document.getElementById("appPrincipal");
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const loginErro = document.getElementById("loginErro");
const cadastroErro = document.getElementById("cadastroErro");
const btnSair = document.getElementById("btnSair");
const linkCriarConta = document.getElementById("linkCriarConta");
const linkVoltarLogin = document.getElementById("linkVoltarLogin");

function verificarLogin() {
    const token = localStorage.getItem("token");

    if (token) {
        telaLogin.style.display = "none";
        telaCadastro.style.display = "none";
        appPrincipal.style.display = "flex";
    } else {
        telaLogin.style.display = "flex";
        telaCadastro.style.display = "none";
        appPrincipal.style.display = "none";
    }
}

formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();

    loginErro.innerText = "";

    const resultado = await fazerLogin(email, senha);

    if (resultado.token) {
        verificarLogin();
    } else {
        loginErro.innerText = resultado.erro || "Erro ao fazer login.";
    }
});

formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value.trim();

    cadastroErro.innerText = "";

    const resp = await fetch("http://localhost:3000/api/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const dados = await resp.json();

    if (resp.ok) {

        const resultado = await fazerLogin(email, senha);

        if (resultado.token) {
            verificarLogin();
        }

    } else {
        cadastroErro.innerText = dados.erro || "Erro ao cadastrar.";
    }
});

linkCriarConta.addEventListener("click", function (event) {
    event.preventDefault();
    telaLogin.style.display = "none";
    telaCadastro.style.display = "flex";
});

linkVoltarLogin.addEventListener("click", function (event) {
    event.preventDefault();
    telaCadastro.style.display = "none";
    telaLogin.style.display = "flex";
});

btnSair.addEventListener("click", function () {
    localStorage.removeItem("token");
    verificarLogin();
});

verificarLogin();