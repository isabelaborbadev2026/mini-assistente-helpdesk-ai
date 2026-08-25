require('dotenv').config();

const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const autenticar = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bem-vindo à API do Mini Assistente!");
});

// Rotas de login (públicas)
app.use("/api/auth", authRoutes);

// Rotas do assistente de IA (protegidas por login)
app.use("/api", autenticar, aiRoutes);



module.exports = app;