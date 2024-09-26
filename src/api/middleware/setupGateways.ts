import { createMiddleware } from 'hono/factory'
import { InMemoryPacienteGateway } from '../../gateways/inMemoryPacienteGateway'
import { InMemoryMedicoGateway } from '../../gateways/inMemoryMedicoGateway'
import { PacienteGateway } from '../../interfaces/pacienteGateway'
import { MedicoGateway } from '../../interfaces/medicoGateway'
import { config } from '../../config'
import { CognitoMedicoGateway } from '../../gateways/cognitoMedicoGateway'
import { CognitoPacienteGateway } from '../../gateways/cognitoPacienteGateway'

export type UseCasesVariables = {
  pacienteGateway: PacienteGateway,
  medicoGateway: MedicoGateway,
}

export const setupGateways = createMiddleware<{Variables: UseCasesVariables}>(async (c, next) => {
  const env = config.env
  const pacienteGateway = env === 'test' ? InMemoryPacienteGateway : CognitoPacienteGateway;
  const medicoGateway = env === 'test' ? InMemoryMedicoGateway : CognitoMedicoGateway;
  c.set('pacienteGateway', pacienteGateway)
  c.set('medicoGateway', medicoGateway)
  await next()
})