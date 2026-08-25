const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const iaService = require("../services/iaService");

// =========================
// CAMINHO DO ARQUIVO JSON
// =========================

const caminhoHistorico = path.join(
    __dirname,
    "../data/historico.json"
);

console.log(
    "Caminho do JSON:",
    caminhoHistorico
);


// =====================================================
// POST /pergunta
// =====================================================

router.post("/pergunta", async (req, res) => {

    try {

        const { pergunta } = req.body;


        // =========================
        // VERIFICAR PERGUNTA
        // =========================

        if (!pergunta || pergunta.trim() === "") {

            return res.status(400).json({

                erro: "Digite uma pergunta."

            });

        }


        // =========================
        // CHAMAR IA
        // =========================

        const resposta =
            await iaService.responder(pergunta);


        console.log(
            "Resposta recebida da IA:",
            resposta
        );


        // =========================
        // LER HISTÓRICO
        // =========================

        let historico = [];


        if (fs.existsSync(caminhoHistorico)) {

            const dados =
                fs.readFileSync(
                    caminhoHistorico,
                    "utf8"
                );


            if (dados.trim() !== "") {

                historico =
                    JSON.parse(dados);

            }

        }


        // =========================
        // CRIAR REGISTRO
        // =========================

        const novoRegistro = {

            id: historico.length + 1,

            pergunta: pergunta,

            resposta: resposta,

            criadoEm:
                new Date().toISOString()

        };


        // =========================
        // ADICIONAR
        // =========================

        historico.push(novoRegistro);


        // =========================
        // SALVAR JSON
        // =========================

        fs.writeFileSync(

            caminhoHistorico,

            JSON.stringify(
                historico,
                null,
                4
            ),

            "utf8"

        );


        console.log(
            "Histórico salvo com sucesso."
        );


        // =========================
        // RETORNAR RESPOSTA
        // =========================

        return res.json({

            pergunta: pergunta,

            resposta: resposta

        });


    } catch (erro) {

        console.error(
            "Erro na rota /pergunta:",
            erro
        );


        return res.status(500).json({

            erro:
                erro.message ||
                "Erro interno do servidor."

        });

    }

});


// =====================================================
// GET /historico
// =====================================================

router.get("/historico", (req, res) => {

    try {

        // =========================
        // VERIFICAR SE JSON EXISTE
        // =========================

        if (!fs.existsSync(caminhoHistorico)) {

            return res.json([]);

        }


        // =========================
        // LER JSON
        // =========================

        const dados =
            fs.readFileSync(
                caminhoHistorico,
                "utf8"
            );


        // =========================
        // VERIFICAR SE ESTÁ VAZIO
        // =========================

        if (dados.trim() === "") {

            return res.json([]);

        }


        // =========================
        // CONVERTER JSON
        // =========================

        const historico =
            JSON.parse(dados);


        console.log(
            "Histórico carregado:",
            historico
        );


        // =========================
        // RETORNAR HISTÓRICO
        // =========================

        return res.json(historico);


    } catch (erro) {

        console.error(
            "Erro ao buscar histórico:",
            erro
        );


        return res.status(500).json({

            erro:
                "Não foi possível carregar o histórico."

        });

    }

});


// =========================
// EXPORTAR ROUTER
// =========================

module.exports = router;