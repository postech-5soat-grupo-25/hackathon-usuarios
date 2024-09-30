import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { MedicoUseCases } from "../../use-cases/medicoUseCases";
import { PacienteUseCases } from "../../use-cases/pacienteUseCases";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'

export const getUsuarioLogadoRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "get",
  path: "/me",
  tags: ["Usuário Logado"],
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UsuarioSchema,
        },
      },
      description: "Retorna informações do usuário logado",
    },
  },
});

getUsuarioLogadoRoute.use('/me', auth)

getUsuarioLogadoRoute.openapi(route, async (c) => {
  console.log("Iniciando /me")

  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")
  if (usuario.tipo === "Medicos") {
    console.log("Iniciando fluxo Medicos")
    const medicoUseCases = new MedicoUseCases(pacienteGateway, medicoGateway)
    const medico = await medicoUseCases.obterInformacoesMedicoLogado(usuario.username)
    if (!medico) {
      throw new HTTPException(404, {message: "Médico não encontrado"})
    }
    return c.json(medico)
  }

  if (usuario.tipo === "Pacientes") {
    console.log("Iniciando fluxo Pacientes")
    const pacienteUseCases = new PacienteUseCases(pacienteGateway, medicoGateway)
    const paciente = await pacienteUseCases.obterInformacoesPacienteLogado(usuario.username)
    if (!paciente) {
      throw new HTTPException(404, {message: "Paciente não encontrado"})
    }
    return c.json(paciente)
  }

  throw new HTTPException(403, {message: "Tipo de usuário inválido"})
})