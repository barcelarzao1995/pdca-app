// routes/viagemRoutes.js
import express from 'express';
import {
  criarViagem,
  listarViagens,
  obterViagemPorId,
  atualizarStatusViagem,
  adicionarPontoRota,
} from '../controllers/viagemController.js';
import { autenticarToken } from '../controllers/auth.js';

const router = express.Router();

// Todas as rotas abaixo exigem token JWT
router.post('/', autenticarToken, criarViagem);
router.get('/', autenticarToken, listarViagens);
router.get('/:id', autenticarToken, obterViagemPorId);
router.patch('/:id/status', autenticarToken, atualizarStatusViagem);
router.post('/:id/rota', autenticarToken, adicionarPontoRota);

export default router;
