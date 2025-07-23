// src/middlewares/validate.js
import { ZodSchema } from 'zod';

// é usado para validar os dados antes mesmo que eles cheguem no controller

export function validate({ body, params, query }) {
  return (req, res, next) => {
    try {
      if (body)   req.body   = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query)  req.query  = query.parse(req.query);
      next();
    } catch (e) {
      // \oderro
      return res.status(400).json({
        error: 'Validation failed',
        issues: e.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
  };
}
