import { Usuario } from "../entities/usuario";
import { MedicoGateway } from "../interfaces/medicoGateway";
import { PacienteGateway } from "../interfaces/pacienteGateway";

export class PacienteUseCases {
  private pacienteGateway: PacienteGateway;
  private medicoGateway: MedicoGateway;

  constructor(pacienteGateway: PacienteGateway, medicoGateway: MedicoGateway) {
    this.pacienteGateway = pacienteGateway;
    this.medicoGateway = medicoGateway;
  }

  async obterInformacoesPacienteLogado(username: string) {
    return await this.pacienteGateway.buscarPacientePorUsername(username);
  }

  async obterInformacoesMedico(username: string) {
    return await this.medicoGateway.buscarMedicoPorUsername(username);
  }

  async atualizarInformacoesPacienteLogado(username: string, novasInformacoes: Partial<Usuario>) {
    return await this.pacienteGateway.atualizarPaciente({username, ...novasInformacoes});
  }

  async excluirContaPacienteLogado(username: string) {
    return await this.pacienteGateway.deletarPaciente(username);
  }
}