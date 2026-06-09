import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${env.PORT} em modo ${env.NODE_ENV}`);
  });
};

startServer();