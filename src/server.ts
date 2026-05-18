import app from './app';
import { env } from './infrastructure/config/env';

const startServer = () => {
  const PORT = env.PORT;
  
  app.listen(PORT, () => {
    console.log(`🚀 Multi-Tenant SIMRS Backend is running on port ${PORT}`);
    console.log(`BPJS Env: ${env.BPJS_ENV}`);
    console.log(`SATUSEHAT Env: ${env.SATUSEHAT_ENV}`);
  });
};

startServer();
