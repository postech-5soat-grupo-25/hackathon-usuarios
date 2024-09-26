import { CognitoClient } from "../adapters/cognitoClient"
import { config } from "../config"
import { UsuarioSchema } from "../entities/usuario"
import { MedicoInput, MedicoUpdateInput } from "../interfaces/medicoGateway"
import { MedicoGateway } from "../interfaces/medicoGateway"

const medicoUsergroupClient = new CognitoClient(
  config.userpoolId,
  "medico"
)

export const CognitoMedicoGateway: MedicoGateway = {
  async cadastrarMedico(medico: MedicoInput) {
    const newUser = await medicoUsergroupClient.createUser(medico)
    console.info("New user created", newUser);
    const newMedico = UsuarioSchema.parse({
      ...medico,
      tipo: "medico",
    });
    return newMedico
  },
  async buscarMedicoPorUsername(username: string) {
    return await medicoUsergroupClient.getUser(username)
  },
  async listarMedicos() {
    return await medicoUsergroupClient.listUsers();
  },
  async atualizarMedico(medico: MedicoUpdateInput) {
    return await medicoUsergroupClient.updateUserAttributes(medico);
  },
  async deletarMedico(username: string) {
    return await medicoUsergroupClient.deleteUser(username);
  },
};
