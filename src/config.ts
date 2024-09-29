import { z } from 'zod';

const configSchema = z.object({
  env: z.enum(['development', 'test', 'production']).default('development'),
  port: z.coerce.number().default(3000),
  userpoolId: z.string(),
})

console.log("test")
export const config = configSchema.parse({
  env: "production",
  port: "8080",
  userpoolId: "123456",
})