import { UsuarioModel } from '../models/index.js';
import Logger from '../middlewares/logger.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// Criar usuário
export const createUser = asyncHandler(async (req, res) => {
  Logger.info('Admin criando novo usuário', { email: req.body.email, role: req.body.role });
  const user = await UsuarioModel.create(req.body);
  Logger.info(`Usuário criado pelo admin: ${user.email} (ID: ${user.id})`);
  res.status(201).json(user);
});

// Listar usuários
export const getUsers = asyncHandler(async (req, res) => {
  Logger.info('Admin buscando todos os usuários');
  const users = await UsuarioModel.findAll();
  Logger.info(`Admin encontrou ${users.length} usuários`);
  res.json(users);
});

// Buscar usuário por ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Admin buscando usuário ID: ${id}`);
  
  const user = await UsuarioModel.findById(id);
  if (!user) {
    Logger.warn(`Admin: usuário não encontrado: ${id}`);
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  Logger.info(`Admin encontrou usuário: ${user.email}`);
  res.json(user);
});

// Atualizar usuário
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Admin atualizando usuário ID: ${id}`, { email: req.body.email, role: req.body.role });
  
  const user = await UsuarioModel.update(id, req.body);
  Logger.info(`Admin atualizou usuário: ${user.email}`);
  res.json(user);
});

// Excluir usuário
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Admin excluindo usuário ID: ${id}`);
  
  await UsuarioModel.delete(id);
  Logger.info(`Admin excluiu usuário: ${id}`);
  res.json({ message: 'Usuário deletado com sucesso' });
});
