import { DepartamentoModel } from '../models/index.js';
import Logger from '../middlewares/logger.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// Listar todos os departamentos
export const getAll = asyncHandler(async (req, res) => {
  Logger.info('Buscando todos os departamentos');
  const data = await DepartamentoModel.findAll();
  Logger.info(`Encontrados ${data.length} departamentos`);
  res.json(data);
});

// Buscar departamento por ID
export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Buscando departamento ID: ${id}`);
  
  const dept = await DepartamentoModel.findById(id);
  if (!dept) {
    Logger.warn(`Departamento não encontrado: ${id}`);
    return res.status(404).json({ error: 'Departamento não encontrado' });
  }
  
  Logger.info(`Departamento encontrado: ${dept.nome}`);
  res.json(dept);
});

// Criar novo departamento
export const create = asyncHandler(async (req, res) => {
  Logger.info('Criando novo departamento', req.body);
  const dept = await DepartamentoModel.create(req.body);
  Logger.info(`Departamento criado: ${dept.nome} (ID: ${dept.id})`);
  res.status(201).json(dept);
});

// Atualizar departamento
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Atualizando departamento ID: ${id}`, req.body);
  
  const dept = await DepartamentoModel.update(id, req.body);
  Logger.info(`Departamento atualizado: ${dept.nome}`);
  res.json(dept);
});

// Excluir departamento
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Logger.info(`Excluindo departamento ID: ${id}`);
  
  await DepartamentoModel.delete(id);
  Logger.info(`Departamento excluído: ${id}`);
  res.json({ success: true });
});
