import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Segurança e utilitários globais
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Proteção contra ataques de Força Bruta / DDoS básico
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api', limiter);

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'GameForge AI API is running' });
});


app.use(errorHandler);

export default app;