import prisma from '../prisma/client.js';

class RelatorioPontoModel {
  // Listar todos os relatórios
  static async findAll() {
    return await prisma.relatorioPonto.findMany({
      include: {
        usuario: {
          select: { id: true, email: true }
        }
      },
      orderBy: { data: 'desc' }
    });
  }

  // Buscar relatório por ID
  static async findById(id) {
    return await prisma.relatorioPonto.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: {
          select: { id: true, email: true }
        }
      }
    });
  }

  // Buscar relatórios por usuário
  static async findByUsuario(usuarioId) {
    return await prisma.relatorioPonto.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      include: {
        usuario: {
          select: { id: true, email: true }
        }
      },
      orderBy: { data: 'desc' }
    });
  }

  // Criar novo relatório
  static async create(data) {
    return await prisma.relatorioPonto.create({
      data: {
        data: new Date(data.data),
        horasTrabalhadas: parseFloat(data.horasTrabalhadas),
        usuarioId: parseInt(data.usuarioId)
      },
      include: {
        usuario: {
          select: { id: true, email: true }
        }
      }
    });
  }

  // Atualizar relatório
  static async update(id, data) {
    return await prisma.relatorioPonto.update({
      where: { id: parseInt(id) },
      data: {
        data: data.data ? new Date(data.data) : undefined,
        horasTrabalhadas: data.horasTrabalhadas ? parseFloat(data.horasTrabalhadas) : undefined
      },
      include: {
        usuario: {
          select: { id: true, email: true }
        }
      }
    });
  }

  // Excluir relatório
  static async delete(id) {
    return await prisma.relatorioPonto.delete({
      where: { id: parseInt(id) }
    });
  }
}

export default RelatorioPontoModel;
