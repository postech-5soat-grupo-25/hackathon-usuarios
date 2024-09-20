import { Usuario, UsuarioSchema } from "../entities/usuario"
import { PacienteInput, PacienteUpdateInput } from "../interfaces/pacienteGateway"
import { PacienteGateway } from "../interfaces/pacienteGateway"

const pacientes: Usuario[] = [
  {
    cpf: "37543105853",
    nome: "Paciente Exemplo",
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
  async buscarPacientePorCpf(cpf: string) {
    return pacientes.find((paciente) => paciente.cpf === cpf) ?? null;

  },
  async atualizarPaciente(paciente: PacienteUpdateInput) {
    const pacienteIndex = pacientes.findIndex((paciente) => paciente.cpf === paciente.cpf);
    if (pacienteIndex === -1) {
      throw new Error("Paciente não encontrado");
    }
    pacientes[pacienteIndex] = { ...pacientes[pacienteIndex], ...paciente };
    return pacientes[pacienteIndex];
  },
  async deletarPaciente(cpf: string) {
    const pacienteIndex = pacientes.findIndex((paciente) => paciente.cpf === cpf);
    if (pacienteIndex === -1) {
      return false;
    }
    pacientes.splice(pacienteIndex, 1);
    return true;
  }
};