import mongoose from 'mongoose';

const pontoRotaSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const viagemSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
  },
  nomeFuncionario: {
    type: String,
    required: true,
  },
  veiculo: {
  type: String,
  required: true,
  match: /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, // Aceita placas antigas e Mercosul
  },
  area: {
    type: String,
    enum: ['ADM', 'INDÚSTRIA', 'AGRÍCOLA'],
    required: true,
  },
  numeroPassageiros: {
    type: Number,
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
  horarioSaida: {
    type: String,
    required: true,
  },
  kmInicial: {
    type: Number,
    required: true,
  },
  horarioChegada: {
    type: String,
  },
  kmFinal: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['em_andamento', 'finalizada'],
    default: 'em_andamento',
  },
  observacoes: {
    type: String,
    default: '',
  },
  rota: {
    type: [pontoRotaSchema],
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
