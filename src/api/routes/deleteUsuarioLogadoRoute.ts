import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Variables } from "..";
import { MedicoUseCases } from "../../use-cases/medicoUseCases";
import { PacienteUseCases } from "../../use-cases/pacienteUseCases";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'

export const deleteUsuarioLogadoRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "delete",
  path: "/me",
  tags: ["Usuário Logado"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.boolean(),
        },
      },
      description: "Usuário excluído",
    },
  },
});

deleteUsuarioLogadoRoute.use('/me', auth)

deleteUsuarioLogadoRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")
  if (usuario.tipo === "medico") {
    const medicoUseCases = new MedicoUseCases(pacienteGateway, medicoGateway)
    const excluido = await medicoUseCases.excluirContaMedicoLogado(usuario.cpf)
    return c.json(excluido)
  }

  if (usuario.tipo === "paciente") {
    const pacienteUseCases = new PacienteUseCases(pacienteGateway, medicoGateway)
    const excluido = await pacienteUseCases.excluirContaPacienteLogado(usuario.cpf)
    return c.json(excluido)
  }

  throw new HTTPException(403, {message: "Tipo de usuário inválido"})
})