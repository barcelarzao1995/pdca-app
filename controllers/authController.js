const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const novoUsuario = await User.create({ name, email, password: hashed });

    const token = gerarToken(novoUsuario._id);

    // Retorna o token e os dados do usuário (sem a senha)
    res.status(201).json({
      user: {
        _id: novoUsuario._id,
        name: novoUsuario.name,
        email: novoUsuario.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario._id);

    // Retorna o token e os dados do usuário (sem a senha)
    res.json({
      user: {
        _id: usuario._id,
        name: usuario.name,
        email: usuario.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};
