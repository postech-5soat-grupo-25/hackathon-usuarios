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

  async obterInformacoesMedicoLogado(cpf: string) {
    return await this.medicoGateway.buscarMedicoPorCpf(cpf);
  }

  async obterInformacoesPaciente(cpf: string) {
    return await this.pacienteGateway.buscarPacientePorCpf(cpf);
  }

  async atualizarInformacoesMedicoLogado(cpf: string, novasInformacoes: Partial<Usuario>) {
    return await this.medicoGateway.atualizarMedico({cpf, ...novasInformacoes});
  }

  async excluirContaMedicoLogado(cpf: string) {
    return await this.medicoGateway.deletarMedico(cpf);
  }
}