import { Usuario, UsuarioSchema } from "../entities/usuario"
import { MedicoInput, MedicoUpdateInput } from "../interfaces/medicoGateway"
import { MedicoGateway } from "../interfaces/medicoGateway"

const medicos: Usuario[] = [
  {
    cpf: "37543105853",
    nome: "Médico Exemplo",
    username: "medico@email.com",
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
  async buscarMedicoPorUsername(username: string) {
    return medicos.find((paciente) => paciente.username === username) ?? null;
  },
  async listarMedicos() {
    return medicos;
  },
  async atualizarMedico(paciente: MedicoUpdateInput) {
    const pacienteIndex = medicos.findIndex((paciente) => paciente.username === paciente.username);
    if (pacienteIndex === -1) {
      throw new Error("Medico não encontrado");
    }
    medicos[pacienteIndex] = { ...medicos[pacienteIndex], ...paciente };
    return medicos[pacienteIndex];
  },
  async deletarMedico(username: string) {
    const pacienteIndex = medicos.findIndex((paciente) => paciente.username === username);
    if (pacienteIndex === -1) {
      return false;
    }
    medicos.splice(pacienteIndex, 1);
    return true;
  }
};