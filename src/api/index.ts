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
import { getPacienteListRoute } from './routes/getPacienteListRoute'
import { getMedicoListRoute } from './routes/getMedicoListRoute'
import { updateMedicoRoute } from './routes/updateMedicoRoute'
import { deleteMedicoRoute } from './routes/deleteMedicoRoute'
import { deletePacienteRoute } from './routes/deletePacienteRoute'
import { updatePacienteRoute } from './routes/updatePacienteRoute'

export type Variables = UseCasesVariables & AuthVariables

export const app = new OpenAPIHono<{Variables: Variables}>()

const apiRoute = '/usuarios-service/'

app.use("*", logger())
app.use(setupGateways)

app.get('/', (c) => {
  return c.redirect('/docs')
})

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
})

app.get('/usuarios-service/docs', swaggerUI({ url: '/openapi' }))

app.get('/health', (c) => {
  return c.json({ status: 'UP' })
});

app.route(apiRoute, cadastroRoute)

app.route(apiRoute, getUsuarioLogadoRoute)
app.route(apiRoute, updateUsuarioLogadoRoute)
app.route(apiRoute, deleteUsuarioLogadoRoute)

app.route(apiRoute, getMedicoRoute)
app.route(apiRoute, getMedicoListRoute)
app.route(apiRoute, updateMedicoRoute)
app.route(apiRoute, deleteMedicoRoute)

app.route(apiRoute, getPacienteRoute)
app.route(apiRoute, getPacienteListRoute)
app.route(apiRoute, updatePacienteRoute)
app.route(apiRoute, deletePacienteRoute)

app.doc('/openapi', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hackaton Pós Tech - User Service',
  },
})

const port = 8080;

export default {
  port, // Defina a porta desejada
  fetch: app.fetch // O Hono utiliza a função fetch para manipular requisições
};