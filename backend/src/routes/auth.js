import { Router } from 'express';
import { register, login, logout, getNonAdminUsers } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../middlewares/auth.schema.js';

const router = Router();

// valida o body contra o registerSchema antes de chamar register()
router.post('/register', validate({ body: registerSchema }), register);

// valida o body contra o loginSchema antes de chamar login()
router.post('/login', validate({ body: loginSchema }), login);

router.post('/logout', logout);

router.get('/usuarios', getNonAdminUsers);

export default router;
