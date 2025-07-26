// controllers/viagemController.js
import Viagem from '../models/Viagem.js';

// Criar nova viagem (Parte 1 - Início da Viagem)
export const criarViagem = async (req, res) => {
  try {
    const {
      motorista,
      placa,
      localSaida,
      localDestino,
      dataSaida,
      horarioSaida,
      kmInicial,
      veiculo,
      area,
      numPassageiros
    } = req.body;

    const novaViagem = new Viagem({
      motorista,
      placa,
      localSaida,
      localDestino,
      dataSaida,
      horarioSaida,
      kmInicial,
      veiculo,
      area,
      numPassageiros,
      status: 'em andamento',
      criadoPor: req.userId,
    });

    const viagemSalva = await novaViagem.save();
    res.status(201).json(viagemSalva);
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ error: 'Erro ao criar viagem.' });
  }
};

// Finalizar viagem (Parte 2)
export const finalizarViagem = async (req, res) => {
  try {
    const { horarioRetorno, kmFinal } = req.body;

    const viagem = await Viagem.findById(req.params.id);
    if (!viagem) {
      return res.status(404).json({ error: 'Viagem não encontrada.' });
    }

    viagem.horarioRetorno = horarioRetorno;
    viagem.kmFinal = kmFinal;
    viagem.status = 'finalizada';

    await viagem.save();
    res.json(viagem);
  } catch (error) {
    console.error('Erro ao finalizar viagem:', error);
    res.status(500).json({ error: 'Erro ao finalizar viagem.' });
  }
};

// Atualizar status (ex: "em andamento", "finalizada")
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
    res.status(500).json({ error: 'Erro ao atualizar status da viagem.' });
  }
};

// Adicionar ponto de rota via GPS
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

// Listar todas as viagens
export const listarViagens = async (req, res) => {
  try {
    const viagens = await Viagem.find().populate('criadoPor', 'matricula');
    res.json(viagens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar viagens.' });
  }
};

// Obter viagem por ID
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
