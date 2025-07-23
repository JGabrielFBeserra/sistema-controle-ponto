// src/routes/relatorios.js
import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { relatorioSchema, idSchema } from '../middlewares/validation.js';
import * as ctrl from '../controllers/relatorioController.js';

const router = Router();
router.use(auth);

// estática de PDF — precisa estar aqui, antes de '/:id'
router.get('/pdf', ctrl.generatePdf);

// 2) Rotas sem parâmetros
router.get('/', ctrl.getAll);
router.post('/', validate({ body: relatorioSchema }), ctrl.create);

// 3) com ID — somente depois de todas as estáticas
router.get('/:id', validate({ params: idSchema }), ctrl.getById);
router.put('/:id', validate({ params: idSchema, body: relatorioSchema }), ctrl.update);
router.delete('/:id', validate({ params: idSchema }), ctrl.remove);

export default router;
