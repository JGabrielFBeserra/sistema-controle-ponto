import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs';

class UsuarioModel {
  // Listar todos os usuários
  static async findAll() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        funcionario: true
      }
    });
  }

  // Buscar usuário por ID
  static async findById(id) {
    return await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        role: true,
        funcionario: true
      }
    });
  }

  // Buscar usuário por email (com senha para auth)
  static async findByEmailWithPassword(email) {
    return await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
  }

  // Criar novo usuário
  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return await prisma.usuario.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role || 'funcionario'
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
  }

  // Atualizar usuário
  static async update(id, data) {
    const updateData = {};
    
    if (data.email) {
      updateData.email = data.email.toLowerCase().trim();
    }
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    if (data.role) {
      updateData.role = data.role;
    }

    return await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true
      }
    });
  }

  // Excluir usuário
  static async delete(id) {
    return await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });
  }

  // Verificar senha
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export default UsuarioModel;
