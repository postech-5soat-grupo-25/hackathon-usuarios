import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export type AuthVariables = {
  usuario: {
    cpf: string,
    tipo: string,
  },
}

// TODO: refatorar para ser compatível com info vindo do API gateway
export const auth = createMiddleware<{Variables: AuthVariables}>(async (c, next) => {
  // const tipo = c.req.header('x-role')
  // if (!tipo) throw new HTTPException(401 ,{message: 'Usuário não autenticado'})
  c.set('usuario', {cpf: '09785545660', tipo: 'paciente'})
  await next()
})