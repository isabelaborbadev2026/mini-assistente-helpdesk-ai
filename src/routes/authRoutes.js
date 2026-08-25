const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { compararSenha, gerarToken, hashSenha } = require('../utils/authUtils');
const autenticar = require('../middleware/authMiddleware');

const usuariosPath = path.join(__dirname, '../data/usuarios.json');

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const senhaValida = await compararSenha(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = gerarToken(usuario);
  res.json({ token, usuario: { id: usuario.id, email: usuario.email } });
});

router.post('/registrar', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));

  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
  }

  const senhaHash = await hashSenha(senha);

  const novoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    email: email,
    senha: senhaHash
  };

  usuarios.push(novoUsuario);

  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2), 'utf-8');

  res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
});

router.post('/trocar-senha', autenticar, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ erro: 'Senha atual e nova senha são obrigatórias' });
  }

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
  const usuario = usuarios.find(u => u.id === req.usuario.id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  const senhaValida = await compararSenha(senhaAtual, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Senha atual incorreta' });
  }

  usuario.senha = await hashSenha(novaSenha);

  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2), 'utf-8');

  res.json({ mensagem: 'Senha alterada com sucesso' });
});

module.exports = router;