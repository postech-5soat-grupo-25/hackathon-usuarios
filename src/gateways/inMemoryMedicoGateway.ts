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
  async cadastrarMedico(medico: MedicoInput) {
    const newMedico = UsuarioSchema.parse(medico);
    medicos.push(newMedico);
    return newMedico;
  },
  async buscarMedicoPorUsername(username: string) {
    return medicos.find((medico) => medico.username === username) ?? null;
  },
  async listarMedicos() {
    return medicos;
  },
  async atualizarMedico(medico: MedicoUpdateInput) {
    const medicoIndex = medicos.findIndex((medico) => medico.username === medico.username);
    if (medicoIndex === -1) {
      throw new Error("Medico não encontrado");
    }
    medicos[medicoIndex] = { ...medicos[medicoIndex], ...medico };
    return medicos[medicoIndex];
  },
  async deletarMedico(username: string) {
    const medicoIndex = medicos.findIndex((medico) => medico.username === username);
    if (medicoIndex === -1) {
      return false;
    }
    medicos.splice(medicoIndex, 1);
    return true;
  }
};