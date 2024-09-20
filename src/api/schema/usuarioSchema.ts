import { z } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { CpfSchema } from "../../entities/cpf";

export const UsuarioUpdateInputSchema = z
  .object({
    ...UsuarioSchema.partial().shape,
    senha: z.string().optional(),
    confirmacaoSenha: z.string().optional(),
  })
  .refine((data) => data.senha === data.confirmacaoSenha, {
    message: "As senhas não conferem",
    path: ["confirmacaoSenha"],
  })
  .openapi("UsuarioUpdateInput");

export const FetchUserParamSchema = z.object({
  cpf: CpfSchema
    .openapi({
      param: {
        name: 'cpf',
        in: 'path',
      },
      example: '00000000000',
      description: 'CPF do usuário',
    }),
})