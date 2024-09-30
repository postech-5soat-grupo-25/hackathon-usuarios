import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { jwtDecode, JwtPayload } from 'jwt-decode'

export type AuthVariables = {
  usuario: {
    username: string,
    tipo: string,
  },
}

const groupToTipo = {
  Medicos: 'medico',
  Pacientes: 'paciente',
  Admins: 'admin',
}

type TokenPayload = JwtPayload & {
  "cognito:groups"?: string[],
  username?: string,
}

export const auth = createMiddleware<{Variables: AuthVariables}>(async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1]
  if (!token) throw new HTTPException(401 ,{message: 'Usuário não autenticado'})
  const decoded = jwtDecode<TokenPayload>(token)
  const userGroup = decoded["cognito:groups"]?.[0]
  const tipo = groupToTipo[userGroup as keyof typeof groupToTipo]
  const username = decoded.username
  if (!tipo || !username) throw new HTTPException(401, {message: 'Usuário não autenticado'})
  c.set('usuario', {username, tipo})
  await next()
})