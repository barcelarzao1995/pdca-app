// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/Usuario.js';

export const registrarUsuario = async (req, res) => {
  try {
    const { matricula, senha, nome, tipo } = req.body;

    const usuarioExistente = await User.findOne({ matricula });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Matrícula já cadastrada.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({
      matricula,
      senha: senhaCriptografada,
      nome,
      tipo: tipo || 'comum',
    });

    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

export const login = async (req, res) => {
  try {
    const { matricula, senha } = req.body;
    const usuario = await User.findOne({ matricula });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      tipo: usuario.tipo,
      nome: usuario.nome,
      matricula: usuario.matricula,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login.' });
  }
};
