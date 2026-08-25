const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");


// =========================
// GEMINI
// =========================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =========================
// GROQ
// =========================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// =========================
// FUNÇÃO PRINCIPAL - GEMINI
// =========================

async function responder(pergunta) {

    try {

        const resposta = await ai.models.generateContent({

            model: "gemini-flash-latest",

            contents: `
Responda à pergunta abaixo de forma clara e organizada.

Quando precisar mostrar código de programação:

- Use Markdown.
- Coloque o código dentro de blocos de código.
- Informe a linguagem usada no bloco.
- Não coloque código de programação fora dos blocos de código.

Exemplo:

\`\`\`javascript
const nome = "Maria";
console.log(nome);
\`\`\`

Pergunta do usuário:

${pergunta}
`
        });

        return resposta.text;


    } catch (erro) {

        console.error(
            "Erro na API do Gemini:",
            erro
        );


        // =========================
        // FALLBACK PARA GROQ
        // =========================

        if (
            erro.status === 503 ||
            erro.status === 429
        ) {

            console.log(
                "Gemini indisponível. Tentando Groq..."
            );

            return await responderGroq(pergunta);
        }


        // =========================
        // ERRO DE AUTENTICAÇÃO
        // =========================

        if (
            erro.status === 401 ||
            erro.status === 403
        ) {

            throw new Error(
                "Falha de autenticação com a API do Gemini. Verifique a chave configurada."
            );
        }


        // =========================
        // OUTROS ERROS
        // =========================

        throw new Error(
            "Não foi possível obter uma resposta da IA no momento. Tente novamente mais tarde."
        );
    }
}


// =========================
// FUNÇÃO - GROQ
// =========================

async function responderGroq(pergunta) {

    try {

        const resposta = await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages: [
                {
                    role: "system",
                    content: `
Você é um assistente de IA.

Responda às perguntas de forma clara e organizada.

Quando precisar mostrar código de programação:

- Use Markdown.
- Coloque o código dentro de blocos de código.
- Informe a linguagem usada no bloco.
- Não coloque código de programação fora dos blocos de código.

Exemplo:

\`\`\`javascript
const nome = "Maria";
console.log(nome);
\`\`\`
`
                },

                {
                    role: "user",
                    content: pergunta
                }
            ]
        });


        return resposta.choices[0].message.content;


    } catch (erro) {

        console.error(
            "Erro na API do Groq:",
            erro
        );


        // =========================
        // LIMITE DO GROQ
        // =========================

        if (erro.status === 429) {

            throw new Error(
                "O Gemini e o Groq atingiram o limite de requisições. Tente novamente mais tarde."
            );
        }


        // =========================
        // AUTENTICAÇÃO GROQ
        // =========================

        if (
            erro.status === 401 ||
            erro.status === 403
        ) {

            throw new Error(
                "Falha de autenticação com o Groq. Verifique a chave GROQ_API_KEY."
            );
        }


        // =========================
        // OUTROS ERROS
        // =========================

        throw new Error(
            "O Gemini está indisponível e não foi possível obter resposta pelo Groq."
        );
    }
}


// =========================
// EXPORTAÇÃO
// =========================

module.exports = {
    responder,
    responderGroq
};