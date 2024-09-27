import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  Usuario,
  UsuarioCreateInputSchema,
  UsuarioSchema,
} from "../../entities/usuario";
import { Variables } from "..";
import { ExternalUseCases } from "../../use-cases/externalUseCases";

export const cadastroRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "post",
  path: "/cadastro",
  tags: ["Não Logado"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UsuarioCreateInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UsuarioSchema,
        },
      },
      description: "Usuário criado",
    },
    409: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "Usuário já existe",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "Erro interno",
    },
  },
});

cadastroRoute.openapi(route, async (c) => {
  const usuarioInput = await c.req.json();
  const pacienteGateway = c.get("pacienteGateway");
  const medicoGateway = c.get("medicoGateway");
  const externalUseCases = new ExternalUseCases(pacienteGateway, medicoGateway);
  let newUser: Usuario;
  try {
    if (usuarioInput.tipo === "medico") {
      newUser = await externalUseCases.cadastrarMedico(usuarioInput);
    } else {
      newUser = await externalUseCases.cadastrarPaciente(usuarioInput);
    }
  } catch (error) {
    // @ts-ignore
    if (error.message === "User account already exists")
      return c.json({ error: "Usuário já existe" }, 409);

    console.error(error);
    return c.json({ error: "Erro interno" }, 500);
  }
  return c.json(newUser, 200);
});
