import { z } from 'zod';

const configSchema = z.object({
  env: z.enum(['development', 'test', 'production']).default('development'),
  port: z.coerce.number().default(3000),
  userpoolId: z.string(),
})

console.log("Carregando env vars")
export const config = configSchema.parse({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  userpoolId: process.env.USERPOOL_ID,
})