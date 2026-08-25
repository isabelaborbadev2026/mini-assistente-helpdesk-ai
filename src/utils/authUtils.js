const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function hashSenha(senhaPura) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(senhaPura, salt);
}

async function compararSenha(senhaPura, senhaHash) {
  return bcrypt.compare(senhaPura, senhaHash);
}

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

module.exports = { hashSenha, compararSenha, gerarToken };