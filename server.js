const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pdcaRoutes = require('./routes/pdcaRoutes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota base para verificação de funcionamento
app.get('/', (req, res) => {
  res.send('🚀 API PDCA Conlog está rodando!');
});

app.get('/health', (req, res) => res.send('ok'));
app.get('/api/health', (req, res) => res.send('ok'));

// ✅ Rota de verificação da conexão com o MongoDB
app.get('/api/db-check', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send('✅ MongoDB está online e respondendo');
  } catch (err) {
    console.error('❌ Erro ao pingar o MongoDB:', err);
    res.status(500).send('❌ MongoDB inacessível');
  }
});

// Rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/pdca', pdcaRoutes);

// Rota não encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({ message: '❌ Rota não encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err.stack);
  res.status(500).json({ message: '❌ Erro interno do servidor' });
});

// Conexão com MongoDB e inicialização do servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));
