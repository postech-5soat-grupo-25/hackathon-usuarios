import { CognitoClient } from "../adapters/cognitoClient"
import { config } from "../config"
import { UsuarioSchema } from "../entities/usuario"
import { PacienteInput, PacienteUpdateInput } from "../interfaces/pacienteGateway"
import { PacienteGateway } from "../interfaces/pacienteGateway"

const pacienteUsergroupClient = new CognitoClient(
  config.userpoolId,
  "paciente"
)

export const CognitoPacienteGateway: PacienteGateway = {
  async cadastrarPaciente(paciente: PacienteInput) {
    const newUser = await pacienteUsergroupClient.createUser(paciente)
    console.info("New user created", newUser);
    const newPaciente = UsuarioSchema.parse({
      ...paciente,
      tipo: "paciente",
    });
    return newPaciente
  },
  async buscarPacientePorUsername(username: string) {
    return await pacienteUsergroupClient.getUser(username)
  },
  async listarPacientes() {
    return await pacienteUsergroupClient.listUsers();
  },
  async atualizarPaciente(paciente: PacienteUpdateInput) {
    return await pacienteUsergroupClient.updateUserAttributes(paciente);
  },
  async deletarPaciente(username: string) {
    return await pacienteUsergroupClient.deleteUser(username);
  },
};
