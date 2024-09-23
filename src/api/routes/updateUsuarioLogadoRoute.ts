import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { MedicoUseCases } from "../../use-cases/medicoUseCases";
import { PacienteUseCases } from "../../use-cases/pacienteUseCases";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { UsuarioUpdateInputSchema } from "../schema/usuarioSchema";

export const updateUsuarioLogadoRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "put",
  path: "/me",
  tags: ["Usuário Logado"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UsuarioUpdateInputSchema,
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
      description: "Usuário atualizado",
    },
  },
});

updateUsuarioLogadoRoute.use('/me', auth)

updateUsuarioLogadoRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  const usuarioInput = await c.req.json()

  if (usuario.tipo === "medico") {
    const medicoUseCases = new MedicoUseCases(pacienteGateway, medicoGateway)
    const medico = await medicoUseCases.atualizarInformacoesMedicoLogado(usuario.username, usuarioInput)
    if (!medico) {
      throw new HTTPException(404, {message: "Médico não encontrado"})
    }
    return c.json(medico)
  }

  if (usuario.tipo === "paciente") {
    const pacienteUseCases = new PacienteUseCases(pacienteGateway, medicoGateway)
    const paciente = await pacienteUseCases.atualizarInformacoesPacienteLogado(usuario.username, usuarioInput)
    if (!paciente) {
      throw new HTTPException(404, {message: "Paciente não encontrado"})
    }
    return c.json(paciente)
  }

  throw new HTTPException(403, {message: "Tipo de usuário inválido"})
})