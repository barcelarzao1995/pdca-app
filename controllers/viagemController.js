// controllers/viagemController.js
import Viagem from '../models/Viagem.js';

export const criarViagem = async (req, res) => {
  try {
    const { placa, motorista, data, origem, destino, localidade } = req.body;

    const novaViagem = new Viagem({
      placa,
      motorista,
      data,
      origem,
      destino,
      localidade,
      criadoPor: req.userId,
    });

    const viagemSalva = await novaViagem.save();
    res.status(201).json(viagemSalva);
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ error: 'Erro ao criar viagem.' });
  }
};

export const listarViagens = async (req, res) => {
  try {
    const viagens = await Viagem.find().populate('criadoPor', 'matricula');
    res.json(viagens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar viagens.' });
  }
};

export const obterViagemPorId = async (req, res) => {
  try {
    const viagem = await Viagem.findById(req.params.id);
    if (!viagem) {
      return res.status(404).json({ error: 'Viagem não encontrada.' });
    }
    res.json(viagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar viagem.' });
  }
};

export const atualizarStatusViagem = async (req, res) => {
  try {
    const { status } = req.body;
    const viagemAtualizada = await Viagem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(viagemAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar viagem.' });
  }
};

export const adicionarPontoRota = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const ponto = { latitude, longitude, timestamp: new Date() };

    const viagem = await Viagem.findById(req.params.id);
    if (!viagem) {
      return res.status(404).json({ error: 'Viagem não encontrada.' });
    }

    viagem.rota.push(ponto);
    await viagem.save();

    res.json(viagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar ponto de rota.' });
  }
};
