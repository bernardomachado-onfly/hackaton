import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config.js';
import chatRouter from './routes/chat.js';

validateConfig();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api', chatRouter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.listen(config.port, () => {
  console.log(`🚀 Travel Assistant API running on port ${config.port} [Onfly API integration]`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   CORS origins: ${config.corsOrigins.join(', ')}`);
});
