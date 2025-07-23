import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { usuarioSchema, usuarioUpdateSchema, idSchema } from '../middlewares/validation.js';
import { create, getAll, getById, update, remove } from '../controllers/usuarioController.js';

const router = Router();

// Cria um novo usuário
router.post('/', validate({ body: usuarioSchema }), create);

// Retorna todos os usuários
router.get('/', getAll);

// Retorna um usuário por ID
router.get('/:id', validate({ params: idSchema }), getById);

// Atualiza um usuário baseado no ID
router.put('/:id', validate({ params: idSchema, body: usuarioUpdateSchema }), update);

// Deleta um usuário baseado no ID
router.delete('/:id', validate({ params: idSchema }), remove);

export default router;
