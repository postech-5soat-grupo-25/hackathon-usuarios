import { createMiddleware } from 'hono/factory'
import { InMemoryPacienteGateway } from '../../gateways/inMemoryPacienteGateway'
import { InMemoryMedicoGateway } from '../../gateways/inMemoryMedicoGateway'
import { PacienteGateway } from '../../interfaces/pacienteGateway'
import { MedicoGateway } from '../../interfaces/medicoGateway'

export type UseCasesVariables = {
  pacienteGateway: PacienteGateway,
  medicoGateway: MedicoGateway,
}

export const setupGateways = createMiddleware<{Variables: UseCasesVariables}>(async (c, next) => {
  const pacienteGateway = InMemoryPacienteGateway
  const medicoGateway = InMemoryMedicoGateway;
  c.set('pacienteGateway', pacienteGateway)
  c.set('medicoGateway', medicoGateway)
  await next()
})