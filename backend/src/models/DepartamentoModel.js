import prisma from '../prisma/client.js';

class DepartamentoModel {
  // Listar todos os departamentos
  static async findAll() {
    return await prisma.departamento.findMany({
      include: {
        funcionarios: true
      }
    });
  }

  // Buscar departamento por ID
  static async findById(id) {
    return await prisma.departamento.findUnique({
      where: { id: parseInt(id) },
      include: {
        funcionarios: true
      }
    });
  }

  // Criar novo departamento
  static async create(data) {
    return await prisma.departamento.create({
      data: {
        nome: data.nome.trim(),
        descricao: data.descricao?.trim() || null
      }
    });
  }

  // Atualizar departamento
  static async update(id, data) {
    return await prisma.departamento.update({
      where: { id: parseInt(id) },
      data: {
        nome: data.nome?.trim(),
        descricao: data.descricao?.trim() || null
      }
    });
  }

  // Excluir departamento
  static async delete(id) {
    return await prisma.departamento.delete({
      where: { id: parseInt(id) }
    });
  }
}

export default DepartamentoModel;
