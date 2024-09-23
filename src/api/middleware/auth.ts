import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export type AuthVariables = {
  usuario: {
    username: string,
    tipo: string,
  },
}

// TODO: refatorar para ser compatível com info vindo do API gateway
export const auth = createMiddleware<{Variables: AuthVariables}>(async (c, next) => {
  // const tipo = c.req.header('x-role')
  // if (!tipo) throw new HTTPException(401 ,{message: 'Usuário não autenticado'})
  c.set('usuario', {username: '37543105853', tipo: 'admin'})
  await next()
})