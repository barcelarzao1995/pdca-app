// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import viagemRoutes from './routes/viagemRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado com sucesso!'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/viagens', viagemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API do Controle de Viagens está rodando.');
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API rodando normalmente.' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
