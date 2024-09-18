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

  async obterInformacoesPacienteLogado(usuarioLogado: Usuario) {
    return await this.pacienteGateway.buscarPacientePorCpf(usuarioLogado.cpf);
  }

  async obterInformacoesMedico(cpf: string) {
    return await this.medicoGateway.buscarMedicoPorCpf(cpf);
  }

  async atualizarInformacoesPacienteLogado(usuarioLogado: Usuario, novasInformacoes: Partial<Usuario>) {
    return await this.pacienteGateway.atualizarPaciente({cpf: usuarioLogado.cpf, ...novasInformacoes});
  }

  async excluirContaPacienteLogado(usuarioLogado: Usuario) {
    return await this.pacienteGateway.deletarPaciente(usuarioLogado.cpf);
  }
}