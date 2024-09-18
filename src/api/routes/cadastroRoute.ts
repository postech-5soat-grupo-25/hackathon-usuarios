import { createRoute, RouteHandler, OpenAPIHono } from "@hono/zod-openapi";
import { UsuarioSchema } from "../../entities/usuario";

export const cadastroRoute = new OpenAPIHono();

const route = createRoute({
  method: "post",
  path: "/cadastro",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UsuarioSchema,
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
      description: "Retrieve the user",
    },
  },
});

cadastroRoute.openapi(route, async (c) => {
  const usuario = await c.req.json();
  return c.json(usuario);
});