import { Usuario, UsuarioSchema } from "../entities/usuario"
import { MedicoInput, MedicoUpdateInput } from "../interfaces/medicoGateway"
import { MedicoGateway } from "../interfaces/medicoGateway"

const medicos: Usuario[] = [
  {
    cpf: "37543105853",
    nome: "Médico Exemplo",
    email: "medico@email.com",
    tipo: "medico",
    crm: "1234567",
  }
];

export const InMemoryMedicoGateway: MedicoGateway = {
  async cadastrarMedico(paciente: MedicoInput) {
    const newMedico = UsuarioSchema.parse(paciente);
    medicos.push(newMedico);
    return newMedico;
  },
  async buscarMedicoPorCpf(cpf: string) {
    return medicos.find((paciente) => paciente.cpf === cpf) ?? null;
  },
  async listarMedicos() {
    return medicos;
  },
  async atualizarMedico(paciente: MedicoUpdateInput) {
    const pacienteIndex = medicos.findIndex((paciente) => paciente.cpf === paciente.cpf);
    if (pacienteIndex === -1) {
      throw new Error("Medico não encontrado");
    }
    medicos[pacienteIndex] = { ...medicos[pacienteIndex], ...paciente };
    return medicos[pacienteIndex];
  },
  async deletarMedico(cpf: string) {
    const pacienteIndex = medicos.findIndex((paciente) => paciente.cpf === cpf);
    if (pacienteIndex === -1) {
      return false;
    }
    medicos.splice(pacienteIndex, 1);
    return true;
  }
};