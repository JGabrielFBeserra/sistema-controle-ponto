import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  // Tenta obter o token do cookie
  let token = req.cookies.token;
  // Se não tiver, tenta do header Authorization
  const authHeader = req.headers.authorization;
  if (!token && authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  //token → veio do cabeçalho da requisição.

  //process.env.JWT_SECRET → é a chave secreta usada pra assinar/verificar o token.

  //Se o token for válido, ele devolve o payload, no caso a senha descriptografada.
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //JWT_SECRETE é minha senha forte que eu defino em .env
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
