const express = require('express')
const PratoController = require('../controllers/prato.controller')
const AutenticacaoMiddleware = require('../../usuario/middleware/usuario.middleware')

const router = express.Router()

// Rotas públicas (para visualizar o cardápio)
router.get('/pratos', PratoController.listarPratos)
router.get('/pratos/:id', PratoController.listarPratoPorId)

// Rotas protegidas (para gerenciar o cardápio - apenas usuários autenticados)
router.post('/pratos', AutenticacaoMiddleware.autenticarToken, PratoController.registrar)
router.put('/pratos/:id', AutenticacaoMiddleware.autenticarToken, PratoController.editarPrato)
router.delete('/pratos/:id', AutenticacaoMiddleware.autenticarToken, PratoController.deletarPrato)
router.patch('/pratos/:id/disponibilidade', AutenticacaoMiddleware.autenticarToken, PratoController.alterarDisponibilidade)

module.exports = router
