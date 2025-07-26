import express from 'express';
import {
  criarViagem,
  listarViagens,
  obterViagemPorId,
  atualizarStatusViagem,
  adicionarPontoRota,
  finalizarViagem
} from '../controllers/viagemController.js';
import { autenticarToken } from '../middleware/auth.js';

const router = express.Router();

// Criar viagem (Início da Viagem)
router.post('/', autenticarToken, criarViagem);

// Finalizar viagem (Parte 2)
router.patch('/:id/finalizar', autenticarToken, finalizarViagem);

// Atualizar status (opcional)
router.patch('/:id/status', autenticarToken, atualizarStatusViagem);

// Adicionar ponto de rota via GPS
router.patch('/:id/rota', autenticarToken, adicionarPontoRota);

// Listar todas as viagens
router.get('/', autenticarToken, listarViagens);

// Obter viagem por ID
router.get('/:id', autenticarToken, obterViagemPorId);

export default router;
