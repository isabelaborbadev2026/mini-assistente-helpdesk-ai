const express = require("express");
const iaService = require("../services/iaService");

const router = express.Router();

router.post("/pergunta", async (req, res) => {
    try {
        const pergunta = req.body.pergunta;

        const resposta = await iaService.responder(pergunta);

        res.json({
            resposta
        });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
});

module.exports = router;