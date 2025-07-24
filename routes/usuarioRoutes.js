// routes/usuarioRoutes.js
import express from 'express';
import { registrarUsuario } from '../controllers/authController.js';
import { autenticarToken, verificarAdmin } from '../controllers/auth.js';

const router = express.Router();

router.post('/registrar', autenticarToken, verificarAdmin, registrarUsuario);

export default router;
