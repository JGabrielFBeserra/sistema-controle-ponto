import { UsuarioModel } from '../models/index.js';
import Logger from '../middlewares/logger.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// Criar usuário
export const create = asyncHandler(async (req, res) => {
  Logger.info('Criando novo usuário', { email: req.body.email, role: req.body.role });
  const user = await UsuarioModel.create(req.body);
  Logger.info(`Usuário criado: ${user.email} (ID: ${user.id})`);
  res.status(201).json(user);
});

// Listar todos os usuários
export const getAll = asyncHandler(async (req, res) => {
  Logger.info('Buscando todos os usuários');
  const users = await UsuarioModel.findAll();
  Logger.info(`Encontrados ${users.length} usuários`);
  res.json(users);
});

// Buscar usuário por ID
export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Buscando usuário ID: ${id}`);
  
  const user = await UsuarioModel.findById(id);
  if (!user) {
    Logger.warn(`Usuário não encontrado: ${id}`);
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  Logger.info(`Usuário encontrado: ${user.email}`);
  res.json(user);
});

// Atualizar usuário
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Atualizando usuário ID: ${id}`, { email: req.body.email, role: req.body.role });
  
  const user = await UsuarioModel.update(id, req.body);
  Logger.info(`Usuário atualizado: ${user.email}`);
  res.json(user);
});

// Excluir usuário
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Excluindo usuário ID: ${id}`);
  
  await UsuarioModel.delete(id);
  Logger.info(`Usuário excluído: ${id}`);
  res.json({ success: true });
});
