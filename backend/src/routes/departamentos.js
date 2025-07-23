import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { departamentoSchema, departamentoUpdateSchema, idSchema } from '../middlewares/validation.js';
import * as ctrl from '../controllers/departamentoController.js';

const router = Router();

// Aplicar auth em todas as rotas
router.use(auth);

// Rotas CRUD
router.get('/', ctrl.getAll);
router.get('/:id', validate({ params: idSchema }), ctrl.getById);
router.post('/', validate({ body: departamentoSchema }), ctrl.create);
router.put('/:id', validate({ params: idSchema, body: departamentoUpdateSchema }), ctrl.update);
router.delete('/:id', validate({ params: idSchema }), ctrl.remove);

export default router;
