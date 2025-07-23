import { FuncionarioModel, DepartamentoModel } from '../models/index.js';
import Logger from '../middlewares/logger.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// Criar funcionário
export const create = asyncHandler(async (req, res) => {
  Logger.info('Criando novo funcionário', req.body);
  const func = await FuncionarioModel.create(req.body);
  Logger.info(`Funcionário criado: ${func.nome} (ID: ${func.id})`);
  res.status(201).json(func);
});

// Listar todos os funcionários
export const getAll = asyncHandler(async (req, res) => {
  Logger.info('Buscando todos os funcionários');
  const data = await FuncionarioModel.findAll();
  Logger.info(`Encontrados ${data.length} funcionários`);
  res.json(data);
});

// Buscar funcionário por ID
export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Buscando funcionário ID: ${id}`);
  
  const item = await FuncionarioModel.findById(id);
  if (!item) {
    Logger.warn(`Funcionário não encontrado: ${id}`);
    return res.status(404).json({ error: 'Funcionário não encontrado' });
  }
  
  Logger.info(`Funcionário encontrado: ${item.nome}`);
  res.json(item);
});

// Atualizar funcionário
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Atualizando funcionário ID: ${id}`, req.body);
  
  const updated = await FuncionarioModel.update(id, req.body);
  Logger.info(`Funcionário atualizado: ${updated.nome}`);
  res.json(updated);
});

// Excluir funcionário
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Excluindo funcionário ID: ${id}`);
  
  await FuncionarioModel.delete(id);
  Logger.info(`Funcionário excluído: ${id}`);
  res.json({ success: true });
});

// Views para EJS
export const renderFuncionarioView = asyncHandler(async (req, res) => {
  Logger.info('Renderizando página de funcionários');
  const funcionarios = await FuncionarioModel.findAll();
  const departamentos = await DepartamentoModel.findAll();
  res.render('funcionarios', { funcionarios, departamentos });
});

export const renderEditFuncionarioView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Renderizando página de edição do funcionário ID: ${id}`);
  
  const funcionario = await FuncionarioModel.findById(id);
  if (!funcionario) {
    Logger.warn(`Funcionário não encontrado para edição: ${id}`);
    return res.status(404).render('error', { error: 'Funcionário não encontrado' });
  }
  
  const departamentos = await DepartamentoModel.findAll();
  res.render('editFuncionario', { funcionario, departamentos });
});
