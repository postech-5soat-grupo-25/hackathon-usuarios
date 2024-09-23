import { Usuario } from "../entities/usuario";
import { MedicoGateway } from "../interfaces/medicoGateway";
import { PacienteGateway } from "../interfaces/pacienteGateway";

export class MedicoUseCases {
  private pacienteGateway: PacienteGateway;
  private medicoGateway: MedicoGateway;

  constructor(pacienteGateway: PacienteGateway, medicoGateway: MedicoGateway) {
    this.pacienteGateway = pacienteGateway;
    this.medicoGateway = medicoGateway;
  }

  async obterInformacoesMedicoLogado(username: string) {
    return await this.medicoGateway.buscarMedicoPorUsername(username);
  }

  async obterInformacoesPaciente(username: string) {
    return await this.pacienteGateway.buscarPacientePorUsername(username);
  }

  async atualizarInformacoesMedicoLogado(username: string, novasInformacoes: Partial<Usuario>) {
    return await this.medicoGateway.atualizarMedico({username, ...novasInformacoes});
  }

  async excluirContaMedicoLogado(username: string) {
    return await this.medicoGateway.deletarMedico(username);
  }
}