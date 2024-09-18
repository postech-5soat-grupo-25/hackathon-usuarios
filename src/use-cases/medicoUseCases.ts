import { Usuario } from "../entities/usuario";
import { MedicoGateway, MedicoInput } from "../interfaces/medicoGateway";
import { PacienteGateway, PacienteInput } from "../interfaces/pacienteGateway";

export class MedicoUseCases {
  private pacienteGateway: PacienteGateway;
  private medicoGateway: MedicoGateway;

  constructor(pacienteGateway: PacienteGateway, medicoGateway: MedicoGateway) {
    this.pacienteGateway = pacienteGateway;
    this.medicoGateway = medicoGateway;
  }

  async obterInformacoesMedicoLogado(usuarioLogado: Usuario) {
    return await this.medicoGateway.buscarMedicoPorCpf(usuarioLogado.cpf);
  }

  async obterInformacoesPaciente(cpf: string) {
    return await this.pacienteGateway.buscarPacientePorCpf(cpf);
  }

  async atualizarInformacoesMedicoLogado(usuarioLogado: Usuario, novasInformacoes: Partial<Usuario>) {
    return await this.medicoGateway.atualizarMedico({cpf: usuarioLogado.cpf, ...novasInformacoes});
  }

  async excluirContaMedicoLogado(usuarioLogado: Usuario) {
    return await this.medicoGateway.deletarMedico(usuarioLogado.cpf);
  }
}