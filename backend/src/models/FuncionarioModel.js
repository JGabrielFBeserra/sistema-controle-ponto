import prisma from '../prisma/client.js';

class FuncionarioModel {
  // Listar todos os funcionários
  static async findAll() {
    return await prisma.funcionario.findMany({
      include: {
        departamento: true,
        usuario: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  // Buscar funcionário por ID
  static async findById(id) {
    return await prisma.funcionario.findUnique({
      where: { id: parseInt(id) },
      include: {
        departamento: true,
        usuario: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  // Criar novo funcionário
  static async create(data) {
    return await prisma.funcionario.create({
      data: {
        nome: data.nome.trim(),
        cargo: data.cargo.trim(),
        departamentoId: parseInt(data.departamentoId),
        usuarioId: parseInt(data.usuarioId),
        foto: data.foto || null
      },
      include: {
        departamento: true,
        usuario: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  // Atualizar funcionário
  static async update(id, data) {
    return await prisma.funcionario.update({
      where: { id: parseInt(id) },
      data: {
        nome: data.nome?.trim(),
        cargo: data.cargo?.trim(),
        departamentoId: data.departamentoId ? parseInt(data.departamentoId) : undefined,
        usuarioId: data.usuarioId ? parseInt(data.usuarioId) : undefined,
        foto: data.foto
      },
      include: {
        departamento: true,
        usuario: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  // Excluir funcionário
  static async delete(id) {
    return await prisma.funcionario.delete({
      where: { id: parseInt(id) }
    });
  }
}

export default FuncionarioModel;
