import { Router } from 'express';
import multer from 'multer';
import auth from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { funcionarioSchema, funcionarioUpdateSchema, idSchema } from '../middlewares/validation.js';
import * as ctrl from '../controllers/funcionarioController.js';

const upload = multer();
const router = Router();

router.use(auth);
router.get('/', ctrl.getAll);
router.get('/:id', validate({ params: idSchema }), ctrl.getById);
router.post('/', upload.single('foto'), validate({ body: funcionarioSchema }), ctrl.create);
router.put('/:id', upload.single('foto'), validate({ params: idSchema, body: funcionarioUpdateSchema }), ctrl.update);
router.delete('/:id', validate({ params: idSchema }), ctrl.remove);

export default router;
