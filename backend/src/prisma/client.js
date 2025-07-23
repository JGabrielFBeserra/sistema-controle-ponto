import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;
// O client.js serve pra criar e reaproveitar uma única conexão
//  com o banco usando o Prisma. Assim o código fica mais organizado
//  e evita erro de conexão quando o projeto reinicia ou cresce.