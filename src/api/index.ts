import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cadastroRoute } from './routes/cadastroRoute'

export const app = new OpenAPIHono(
//   {
//   defaultHook: (result, c) => {
//     console.info('defaultHook', result)
//     if (!result.success) {
//       return c.json(
//         {
//           ok: false,
//           errors: result,
//           source: 'custom_error_handler',
//         },
//         422
//       )
//     }
//   },
// }
)

app.get('/', (c) => {
  return c.redirect('/docs')
})

app.get('/docs', swaggerUI({ url: '/openapi' }))

app.route('/', cadastroRoute)

app.doc('/openapi', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hackaton Pós Tech - User Service',
  },
})