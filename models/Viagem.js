// models/Viagem.js
import mongoose from 'mongoose';

const viagemSchema = new mongoose.Schema({
  motorista: {
    type: String,
    required: true,
  },
  placa: {
    type: String,
    required: true,
  },
  localSaida: {
    type: String,
    required: true,
  },
  localDestino: {
    type: String,
    required: true,
  },
  dataSaida: {
    type: Date,
    required: true,
  },
  dataRetorno: {
    type: Date,
    required: false,
  },
  observacoes: {
    type: String,
    default: '',
  },
  rota: {
    type: [Object], // Ex: [{ latitude: -23.5, longitude: -46.6, timestamp: Date }]
    default: [],
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Viagem', viagemSchema);
