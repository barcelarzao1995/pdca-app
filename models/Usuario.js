// models/Usuario.js
import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
    unique: true,
  },
  nome: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['admin', 'comum'],
    default: 'comum',
  },
});

export default mongoose.model('Usuario', usuarioSchema);
