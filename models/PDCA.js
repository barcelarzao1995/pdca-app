const mongoose = require('mongoose');

const pdcaSchema = new mongoose.Schema(
  {
    etapa: { type: String, required: true }, // PLAN, DO, CHECK, ACT
    titulo: { type: String, required: true },
    objetivo: { type: String, required: true },
    prazo: { type: String }, // opcional
    status: { type: String, default: 'pendente' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PDCA', pdcaSchema);
