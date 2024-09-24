import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Variables } from "..";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { FetchUserParamSchema } from "../schema/usuarioSchema";
import { AdminUseCases } from "../../use-cases/adminUseCases";

export const deletePacienteRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "delete",
  path: "/paciente/{username}",
  tags: ["Paciente"],
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: FetchUserParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.boolean(),
        },
      },
      description: "Paciente excluído",
    },
  },
});

deletePacienteRoute.use('/paciente/*', auth)

deletePacienteRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  const { username } = c.req.valid("param");

  if (usuario.tipo === "admin") {
    const adminUseCases = new AdminUseCases(pacienteGateway, medicoGateway);
    const excluido = await adminUseCases.excluirPaciente(username);
    return c.json(excluido);
  }

  throw new HTTPException(403, { message: "Tipo de usuário inválido" });
})