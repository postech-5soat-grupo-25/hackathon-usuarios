import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { FetchUserParamSchema, UsuarioUpdateInputSchema } from "../schema/usuarioSchema";
import { AdminUseCases } from "../../use-cases/adminUseCases";

export const updatePacienteRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "put",
  path: "/paciente/{username}",
  tags: ["Paciente"],
  request: {
    params: FetchUserParamSchema,
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
      description: "Retorna informações do paciente",
    },
  },
});

updatePacienteRoute.use('/paciente/*', auth)

updatePacienteRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  const { username } = c.req.valid("param");
  const usuarioInput = await c.req.json()

  if (usuario.tipo === "admin") {
    const adminUseCases = new AdminUseCases(pacienteGateway, medicoGateway);
    const medico = await adminUseCases.atualizarInformacoesPaciente(username, usuarioInput);
    return c.json(medico);
  }

  throw new HTTPException(403, { message: "Tipo de usuário inválido" });
})