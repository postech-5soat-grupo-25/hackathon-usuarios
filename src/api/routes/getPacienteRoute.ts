import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { MedicoUseCases } from "../../use-cases/medicoUseCases";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { FetchUserParamSchema } from "../schema/usuarioSchema";
import { AdminUseCases } from "../../use-cases/adminUseCases";

export const getPacienteRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "get",
  path: "/paciente/{username}",
  tags: ["Paciente"],
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: FetchUserParamSchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UsuarioSchema,
        },
      },
      description: "Retorna informações do paciente",
    },
  },
});

getPacienteRoute.use('/paciente/*', auth)

getPacienteRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  const { username } = c.req.valid('param')

  if (usuario.tipo === "medico") {
    const medicoUseCases = new MedicoUseCases(pacienteGateway, medicoGateway)
    const paciente = await medicoUseCases.obterInformacoesPaciente(username)
    if (!paciente) {
      throw new HTTPException(404, {message: "Paciente não encontrado"})
    }
    return c.json(paciente)
  }

  if (usuario.tipo === "admin") {
    const adminUseCases = new AdminUseCases(pacienteGateway, medicoGateway)
    const paciente = await adminUseCases.obterInformacoesPaciente(username)
    if (!paciente) {
      throw new HTTPException(404, {message: "Paciente não encontrado"})
    }
    return c.json(paciente)
  }

  throw new HTTPException(403, {message: "Tipo de usuário inválido"})
})