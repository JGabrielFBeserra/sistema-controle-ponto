import { UsuarioModel } from '../models/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import jwt from 'jsonwebtoken';

// Registrar usuário
export const register = asyncHandler(async (req, res) => {
  const user = await UsuarioModel.create(req.body);
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UsuarioModel.findByEmailWithPassword(email);
  if (!user || !(await UsuarioModel.verifyPassword(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logado com sucesso' });
});

// Logout
export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logout realizado' });
};

// Buscar usuários não admin
export const getNonAdminUsers = asyncHandler(async (req, res) => {
  const users = await UsuarioModel.findAll();
  const funcionarios = users.filter(user => user.role !== 'admin');
  res.json(funcionarios);
});
