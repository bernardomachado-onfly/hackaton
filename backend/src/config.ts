export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

export function validateConfig() {
  if (!config.anthropicApiKey) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set — using mock agent');
  }
}
