const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const pdcaController = require('../controllers/pdcaController');

router.post('/', protect, pdcaController.criarEtapa);
router.get('/', protect, pdcaController.listarEtapas);

module.exports = router;
