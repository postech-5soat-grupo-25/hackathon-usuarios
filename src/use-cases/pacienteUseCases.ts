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

  async obterInformacoesPacienteLogado(cpf: string) {
    return await this.pacienteGateway.buscarPacientePorCpf(cpf);
  }

  async obterInformacoesMedico(cpf: string) {
    return await this.medicoGateway.buscarMedicoPorCpf(cpf);
  }

  async atualizarInformacoesPacienteLogado(cpf: string, novasInformacoes: Partial<Usuario>) {
    return await this.pacienteGateway.atualizarPaciente({cpf, ...novasInformacoes});
  }

  async excluirContaPacienteLogado(cpf: string) {
    return await this.pacienteGateway.deletarPaciente(cpf);
  }
}