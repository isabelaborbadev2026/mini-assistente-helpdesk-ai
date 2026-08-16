const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


async function responder(pergunta) {

    try {

        const resposta = await ai.models.generateContent({

            model: "gemini-flash-latest",

            contents: pergunta

        });


        return resposta.text;


    } catch (erro) {

        console.error(
            "Erro na API de IA:",
            erro
        );


        // =========================
        // API TEMPORARIAMENTE INDISPONÍVEL
        // =========================

        if (erro.status === 503) {

            throw new Error(
                "O serviço de IA está temporariamente ocupado. Tente novamente em alguns segundos."
            );
        }


        // =========================
        // LIMITE DE REQUISIÇÕES
        // =========================

        if (erro.status === 429) {

            throw new Error(
                "O serviço de IA atingiu o limite de requisições. Tente novamente em instantes."
            );
        }


        // =========================
        // ERRO DE AUTENTICAÇÃO
        // =========================

        if (
            erro.status === 401 ||
            erro.status === 403
        ) {

            throw new Error(
                "Falha de autenticação com a API de IA. Verifique a chave configurada."
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


module.exports = {
    responder
};