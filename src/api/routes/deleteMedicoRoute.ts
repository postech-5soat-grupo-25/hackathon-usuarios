import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Variables } from "..";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { FetchUserParamSchema } from "../schema/usuarioSchema";
import { AdminUseCases } from "../../use-cases/adminUseCases";

export const deleteMedicoRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "delete",
  path: "/medico/{username}",
  tags: ["Médico"],
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
      description: "Médico excluído",
    },
  },
});

deleteMedicoRoute.use('/paciente/*', auth)

deleteMedicoRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  const { username } = c.req.valid("param");

  if (usuario.tipo === "Admins") {
    const adminUseCases = new AdminUseCases(pacienteGateway, medicoGateway);
    const excluido = await adminUseCases.excluirMedico(username);
    return c.json(excluido);
  }

  throw new HTTPException(403, { message: "Tipo de usuário inválido" });
})