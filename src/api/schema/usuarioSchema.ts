import { z } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";

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
  username: z.string()
    .openapi({
      param: {
        name: 'username',
        in: 'path',
      },
      example: 'usuario@email.com',
      description: 'Username do usuário',
    }),
})