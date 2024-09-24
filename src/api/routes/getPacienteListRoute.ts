import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { auth } from "../middleware/auth";
import { HTTPException } from 'hono/http-exception'
import { AdminUseCases } from "../../use-cases/adminUseCases";

export const getPacienteListRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "get",
  path: "/paciente",
  tags: ["Paciente"],
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(UsuarioSchema),
        },
      },
      description: "Retorna lista de pacientes",
    },
  },
});

getPacienteListRoute.use('/paciente', auth)

getPacienteListRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario")
  const pacienteGateway = c.get("pacienteGateway")
  const medicoGateway = c.get("medicoGateway")

  if (usuario.tipo === "admin") {
    const adminUseCases = new AdminUseCases(pacienteGateway, medicoGateway)
    const pacientes = await adminUseCases.listarPacientes()
    return c.json(pacientes)
  }

  throw new HTTPException(403, {message: "Tipo de usuário inválido"})
})