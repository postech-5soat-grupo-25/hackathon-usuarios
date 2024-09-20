import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Usuario, UsuarioCreateInputSchema, UsuarioSchema } from "../../entities/usuario";
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
      description: "Retrieve the user",
    },
  },
});

cadastroRoute.openapi(route, async (c) => {
  const usuarioInput = await c.req.json()
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")
  const externalUseCases = new ExternalUseCases(pacienteGateway, medicoGateway)
  let newUser: Usuario;
  if (usuarioInput.tipo === "medico") {
    newUser = await externalUseCases.cadastrarMedico(usuarioInput)
  } else {
    newUser = await externalUseCases.cadastrarPaciente(usuarioInput)
  }
  return c.json(newUser)
})