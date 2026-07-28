const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bem-vindo à API do Mini Assistente!");
});

app.use(aiRoutes);

module.exports = app;