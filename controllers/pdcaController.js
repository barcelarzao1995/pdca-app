const PDCA = require('../models/PDCA');

exports.criarEtapa = async (req, res) => {
  try {
    const etapa = new PDCA({ ...req.body, user: req.user._id });
    const salvo = await etapa.save();
    res.status(201).json(salvo);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar etapa', error: err.message });
  }
};
//Filtrar por etapa, status ou mês
exports.listarEtapas = async (req, res) => {
  try {
    const { etapa, status, mes } = req.query;

    const filtro = { user: req.user._id };

    if (etapa) filtro.etapa = etapa;
    if (status) filtro.status = status;
    if (mes) {
      const inicio = new Date(`${mes}-01`);
      const fim = new Date(inicio);
      fim.setMonth(fim.getMonth() + 1);
      filtro.createdAt = { $gte: inicio, $lt: fim };
    }

    const etapas = await PDCA.find(filtro).sort({ createdAt: -1 });
    res.json(etapas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar etapas', error: err.message });
  }
};

//Atualizar uma etapa (PUT /api/pdca/:id)
exports.atualizarEtapa = async (req, res) => {
  try {
    const etapa = await PDCA.findOne({ _id: req.params.id, user: req.user._id });

    if (!etapa) {
      return res.status(404).json({ message: 'Etapa não encontrada' });
    }

    etapa.etapa = req.body.etapa || etapa.etapa;
    etapa.descricao = req.body.descricao || etapa.descricao;
    etapa.status = req.body.status || etapa.status;

    const atualizada = await etapa.save();
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar etapa', error: err.message });
  }
};
//Deletar uma etapa (DELETE /api/pdca/:id)
exports.deletarEtapa = async (req, res) => {
  try {
    const etapa = await PDCA.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!etapa) {
      return res.status(404).json({ message: 'Etapa não encontrada' });
    }

    res.json({ message: 'Etapa deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar etapa', error: err.message });
  }
};
