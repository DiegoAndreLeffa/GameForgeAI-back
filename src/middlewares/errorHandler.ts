import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${err.message}`);

  res.status(500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};