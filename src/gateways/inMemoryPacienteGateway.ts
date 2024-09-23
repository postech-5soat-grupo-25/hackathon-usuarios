import { Usuario, UsuarioSchema } from "../entities/usuario"
import { PacienteInput, PacienteUpdateInput } from "../interfaces/pacienteGateway"
import { PacienteGateway } from "../interfaces/pacienteGateway"

const pacientes: Usuario[] = [
  {
    cpf: "37543105853",
    nome: "Paciente Exemplo",
    username: "paciente@email.com",
    email: "paciente@email.com",
    tipo: "paciente",
  }
];

export const InMemoryPacienteGateway: PacienteGateway = {
  async cadastrarPaciente(paciente: PacienteInput) {
    const newPaciente = UsuarioSchema.parse(paciente);
    pacientes.push(newPaciente);
    return newPaciente;
  },
  async buscarPacientePorUsername(username: string) {
    return pacientes.find((paciente) => paciente.username === username) ?? null;
  },
  async listarPacientes() {
    return pacientes;
  },
  async atualizarPaciente(paciente: PacienteUpdateInput) {
    const pacienteIndex = pacientes.findIndex((paciente) => paciente.username === paciente.username);
    if (pacienteIndex === -1) {
      throw new Error("Paciente não encontrado");
    }
    pacientes[pacienteIndex] = { ...pacientes[pacienteIndex], ...paciente };
    return pacientes[pacienteIndex];
  },
  async deletarPaciente(username: string) {
    const pacienteIndex = pacientes.findIndex((paciente) => paciente.username === username);
    if (pacienteIndex === -1) {
      return false;
    }
    pacientes.splice(pacienteIndex, 1);
    return true;
  }
};