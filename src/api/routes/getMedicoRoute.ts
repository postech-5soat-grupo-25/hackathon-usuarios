import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { MedicoUseCases } from "../../use-cases/medicoUseCases";
import { PacienteUseCases } from "../../use-cases/pacienteUseCases";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { FetchUserParamSchema } from "../schema/usuarioSchema";

export const getMedicoRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "get",
  path: "/medico/{cpf}",
  tags: ["Médico"],
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
      description: "Retorna informações do médico",
    },
  },
});

getMedicoRoute.use('/medico/*', auth)

getMedicoRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  const { cpf } = c.req.valid('param')

  if (usuario.tipo === "paciente") {
    const pacienteUseCases = new PacienteUseCases(pacienteGateway, medicoGateway)
    const medico = await pacienteUseCases.obterInformacoesMedico(cpf)
    if (!medico) {
      throw new HTTPException(404, {message: "Paciente não encontrado"})
    }
    return c.json(medico)
  }

  if (usuario.tipo === "admin") {
    console.info("Admin needs to be implemented")
  }

  throw new HTTPException(403, {message: "Tipo de usuário inválido"})
})