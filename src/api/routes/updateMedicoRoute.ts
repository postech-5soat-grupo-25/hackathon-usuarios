import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";
import { Variables } from "..";
import { PacienteUseCases } from "../../use-cases/pacienteUseCases";
import { auth } from "../middleware/auth";
import { HTTPException } from "hono/http-exception";
import {
  FetchUserParamSchema,
  UsuarioUpdateInputSchema,
} from "../schema/usuarioSchema";
import { AdminUseCases } from "../../use-cases/adminUseCases";

export const updateMedicoRoute = new OpenAPIHono<{
  Variables: Variables;
}>();

const route = createRoute({
  method: "put",
  path: "/medico/{username}",
  tags: ["Médico"],
  security: [
    {
      Bearer: [],
    },
  ],
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
      description: "Retorna informações do médico",
    },
  },
});

updateMedicoRoute.use("/medico/*", auth);

updateMedicoRoute.openapi(route, async (c) => {
  const usuario = c.get("usuario");
  const pacienteGateway = c.get("pacienteGateway");
  const medicoGateway = c.get("medicoGateway");

  const { username } = c.req.valid("param");
  const usuarioInput = await c.req.json()

  if (usuario.tipo === "admin") {
    const adminUseCases = new AdminUseCases(pacienteGateway, medicoGateway);
    const medico = await adminUseCases.atualizarInformacoesMedico(username, usuarioInput);
    return c.json(medico);
  }

  throw new HTTPException(403, { message: "Tipo de usuário inválido" });
});
