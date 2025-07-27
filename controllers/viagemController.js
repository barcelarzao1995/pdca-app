// controllers/viagemController.js
import Viagem from '../models/Viagem.js';

// Função auxiliar para validar placa (modelo antigo e Mercosul)
const validarPlaca = (placa) => /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa.toUpperCase());

// Criar nova viagem (Parte 1 - Início da Viagem)
export const criarViagem = async (req, res) => {
  console.log('➡️ Dados recebidos:', req.body);
  console.log('👤 Usuário:', req.usuario);

  try {
    const {
      matricula,
      nomeFuncionario,
      veiculo,
      area,
      numeroPassageiros,
      localSaida,
      localDestino,
      dataSaida,
      horarioSaida,
      kmInicial
    } = req.body;

    if (!req.usuario?.id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (
      !matricula || !nomeFuncionario || !veiculo || !area ||
      !numeroPassageiros || !localSaida || !localDestino ||
      !dataSaida || !horarioSaida || !kmInicial
    ) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const areasValidas = ['ADM', 'INDÚSTRIA', 'AGRÍCOLA'];
    if (!areasValidas.includes(area)) {
      return res.status(400).json({ error: 'Área inválida. Deve ser ADM, INDÚSTRIA ou AGRÍCOLA.' });
    }

    if (!validarPlaca(veiculo)) {
      return res.status(400).json({ error: 'Placa inválida. Use o formato ABC1234 ou ABC1D23.' });
    }

    const novaViagem = new Viagem({
      matricula,
      nomeFuncionario,
      veiculo,
      area,
      numeroPassageiros,
      localSaida,
      localDestino,
      dataSaida,
      horarioSaida,
      kmInicial,
      criadoPor: req.usuario.id,
    });

    await novaViagem.save();
    res.status(201).json(novaViagem);

  } catch (error) {
    console.error('❌ Erro ao criar viagem:', error);
    res.status(500).json({ error: `Erro ao criar viagem: ${error.message}` });
  }
};

// Finalizar viagem (Parte 2)
export const finalizarViagem = async (req, res) => {
  try {
    const { horarioChegada, kmFinal } = req.body;

    const viagem = await Viagem.findById(req.params.id);
    if (!viagem) {
      return res.status(404).json({ error: 'Viagem não encontrada.' });
    }

    viagem.horarioChegada = horarioChegada;
    viagem.kmFinal = kmFinal;
    viagem.status = 'finalizada';

    await viagem.save();
    res.json(viagem);
  } catch (error) {
    console.error('❌ Erro ao finalizar viagem:', error);
    res.status(500).json({ error: 'Erro ao finalizar viagem.' });
  }
};

// Atualizar status (ex: "em_andamento", "finalizada")
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
    console.error('❌ Erro ao atualizar status:', error);
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
    console.error('❌ Erro ao adicionar ponto de rota:', error);
    res.status(500).json({ error: 'Erro ao adicionar ponto de rota.' });
  }
};

// Listar todas as viagens
export const listarViagens = async (req, res) => {
  try {
    const viagens = await Viagem.find().populate('criadoPor', 'matricula');
    res.json(viagens);
  } catch (error) {
    console.error('❌ Erro ao buscar viagens:', error);
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
    console.error('❌ Erro ao buscar viagem por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar viagem.' });
  }
};
