import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cadastroRoute } from './routes/cadastroRoute'
import { logger } from 'hono/logger'
import { setupGateways, UseCasesVariables } from './middleware/setupGateways'
import { AuthVariables } from './middleware/auth'
import { getUsuarioLogadoRoute } from './routes/getUsuarioLogadoRoute'
import { updateUsuarioLogadoRoute } from './routes/updateUsuarioLogadoRoute'
import { deleteUsuarioLogadoRoute } from './routes/deleteUsuarioLogadoRoute'
import { getMedicoRoute } from './routes/getMedicoRoute'
import { getPacienteRoute } from './routes/getPacienteRoute'

export type Variables = UseCasesVariables & AuthVariables

export const app = new OpenAPIHono<{Variables: Variables}>()

const apiRoute = '/'

app.use(logger())
app.use(setupGateways)

app.get('/', (c) => {
  return c.redirect('/docs')
})

app.get('/docs', swaggerUI({ url: '/openapi' }))

app.route(apiRoute, cadastroRoute)

app.route(apiRoute, getUsuarioLogadoRoute)
app.route(apiRoute, updateUsuarioLogadoRoute)
app.route(apiRoute, deleteUsuarioLogadoRoute)

app.route(apiRoute, getMedicoRoute)

app.route(apiRoute, getPacienteRoute)

app.doc('/openapi', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hackaton Pós Tech - User Service',
  },
})