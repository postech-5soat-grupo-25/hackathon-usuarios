import { z } from 'zod';
import { CpfSchema } from './cpf';
import { CrmSchema } from './crm';

export const UsuarioSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  cpf: CpfSchema,
  crm: CrmSchema.optional(),
  tipo: z.enum(['medico', 'paciente', 'admin']),
}).refine((value) => {
  if (value.tipo === 'medico' && !value.crm) {
    return false;
  }

  return true;
}, {message: "CRM é obrigatório para Médico", path: ['tipo', 'crm']});

export type Usuario = z.infer<typeof UsuarioSchema>;