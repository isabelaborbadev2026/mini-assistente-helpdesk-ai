const pergunta = document.getElementById("pergunta"); 
const botao = document.getElementById("btnEnviar"); 
const resposta = document.getElementById("resposta"); 

botao.addEventListener("click", enviarPergunta);

async function enviarPergunta() {

    try {

        const textoPergunta = pergunta.value;

        if (textoPergunta.trim() === "") {
            alert("Digite uma pergunta.");
            return;
        }

        resposta.innerText = "Pensando...";

        botao.disabled = true;
        botao.innerText = "Pensando...";

        const respostaApi = await fetch("http://localhost:3000/pergunta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pergunta: textoPergunta
            })
        });

        if (!respostaApi.ok) {
            throw new Error("Erro ao obter resposta do servidor.");
        }

        const dados = await respostaApi.json();

        resposta.innerText = dados.resposta;
        pergunta.value = "";

    } catch (erro) {

        resposta.innerText = "Erro ao conectar com o servidor. Tente novamente.";

        console.error(erro);

    } finally {

        botao.disabled = false;
        botao.innerText = "Enviar Pergunta";

    }
}