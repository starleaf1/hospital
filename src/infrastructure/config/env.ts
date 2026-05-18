import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url().default('postgresql://user:password@localhost/db'),
  PORT: z.string().regex(/^\d+$/).default('8080'),
  BPJS_ENV: z.enum(['MOCK', 'PRODUCTION']).default('MOCK'),
  SATUSEHAT_ENV: z.enum(['MOCK', 'SANDBOX']).default('SANDBOX'),
  SATUSEHAT_ORG_ID: z.string().default('faa5a94f-a4fe-41ac-89f6-5da14101afd1'),
  SATUSEHAT_CLIENT_ID: z.string().default('Kh6J0eJuBq8OdBprht3XFupiRd6YEhLxjlg3'),
  SATUSEHAT_CLIENT_SECRET: z.string().default('LjNXC09cl2Iqgekolh5QQvKWbGOWb0EIUFKyyG'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
