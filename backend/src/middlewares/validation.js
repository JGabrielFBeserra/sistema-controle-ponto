import { z } from 'zod';

// ===== ESQUEMAS DE VALIDAÇÃO =====

// Usuário
export const usuarioSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'funcionario']).default('funcionario')
});

export const usuarioUpdateSchema = z.object({
  email: z.string().email('E-mail inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  role: z.enum(['admin', 'funcionario']).optional()
});

// Departamento
export const departamentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  descricao: z.string().max(500, 'Descrição muito longa').optional()
});

export const departamentoUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo').optional(),
  descricao: z.string().max(500, 'Descrição muito longa').optional()
});

// Funcionário
export const funcionarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  cargo: z.string().min(1, 'Cargo é obrigatório').max(100, 'Cargo muito longo'),
  departamentoId: z.coerce.number().int().positive('ID do departamento inválido'),
  usuarioId: z.coerce.number().int().positive('ID do usuário inválido'),
  foto: z.string().url('URL da foto inválida').optional()
});

export const funcionarioUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo').optional(),
  cargo: z.string().min(1, 'Cargo é obrigatório').max(100, 'Cargo muito longo').optional(),
  departamentoId: z.coerce.number().int().positive('ID do departamento inválido').optional(),
  usuarioId: z.coerce.number().int().positive('ID do usuário inválido').optional(),
  foto: z.string().url('URL da foto inválida').optional()
});

// Relatório de Ponto
export const relatorioSchema = z.object({
  data: z.string().datetime('Data inválida'),
  horasTrabalhadas: z.coerce.number()
    .min(0, 'Horas não pode ser negativa')
    .max(24, 'Horas não pode ser maior que 24')
});

// Parâmetros ID
export const idSchema = z.object({
  id: z.coerce.number().int().positive('ID inválido')
});
