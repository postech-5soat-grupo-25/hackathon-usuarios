import { z } from "@hono/zod-openapi";
import { CpfSchema } from "./cpf";
import { CrmSchema } from "./crm";

export const UsuarioSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  cpf: CpfSchema,
  crm: CrmSchema.optional(),
  tipo: z.enum(["medico", "paciente", "admin"]),
}).openapi("Usuario");

export const UsuarioCreateInputSchema = z
  .object({
    ...UsuarioSchema.shape,
    senha: z.string(),
    confirmacaoSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmacaoSenha, {
    message: "As senhas não conferem",
    path: ["confirmacaoSenha"],
  })
  .refine((data) => (data.tipo === "medico" && data.crm) || data.tipo !== "medico", {
    message: "CRM é obrigatório para médicos",
  }).openapi("UsuarioCreateInput");

export type UsuarioCreateInput = z.infer<typeof UsuarioCreateInputSchema>;

export type Usuario = z.infer<typeof UsuarioSchema>;
