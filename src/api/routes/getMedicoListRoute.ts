import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { AdminUseCases } from "../../use-cases/adminUseCases";

export const getMedicoListRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "get",
  path: "/medico",
  tags: ["Médico"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(UsuarioSchema),
        },
      },
      description: "Retorna lista de médicos",
    },
  },
});

getMedicoListRoute.use('/medico', auth)

getMedicoListRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  if (usuario.tipo === "admin") {
    const adminUseCases = new AdminUseCases(pacienteGateway, medicoGateway)
    const medicos = await adminUseCases.listarMedicos()
    return c.json(medicos)
  }

  throw new HTTPException(403, {message: "Tipo de usuário inválido"})
})