import { Usuario, UsuarioSchema } from "../entities/usuario"
import { MedicoInput, MedicoUpdateInput } from "../interfaces/medicoGateway"
import { MedicoGateway } from "../interfaces/medicoGateway"

const pacientes: Usuario[] = [];

export const InMemoryMedicoGateway: MedicoGateway = {
  async cadastrarMedico(paciente: MedicoInput) {
    const newMedico = UsuarioSchema.parse(paciente);
    pacientes.push(newMedico);
    return newMedico;
  },
  async buscarMedicoPorCpf(cpf: string) {
    return pacientes.find((paciente) => paciente.cpf === cpf) ?? null;

  },
  async atualizarMedico(paciente: MedicoUpdateInput) {
    const pacienteIndex = pacientes.findIndex((paciente) => paciente.cpf === paciente.cpf);
    if (pacienteIndex === -1) {
      throw new Error("Medico não encontrado");
    }
    pacientes[pacienteIndex] = { ...pacientes[pacienteIndex], ...paciente };
    return pacientes[pacienteIndex];
  },
  async deletarMedico(cpf: string) {
    const pacienteIndex = pacientes.findIndex((paciente) => paciente.cpf === cpf);
    if (pacienteIndex === -1) {
      return false;
    }
    pacientes.splice(pacienteIndex, 1);
    return true;
  }
};