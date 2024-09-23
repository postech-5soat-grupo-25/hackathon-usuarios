import { Usuario } from "../entities/usuario";
import { MedicoGateway } from "../interfaces/medicoGateway";
import { PacienteGateway } from "../interfaces/pacienteGateway";

export class AdminUseCases {
  private pacienteGateway: PacienteGateway;
  private medicoGateway: MedicoGateway;

  constructor(pacienteGateway: PacienteGateway, medicoGateway: MedicoGateway) {
    this.pacienteGateway = pacienteGateway;
    this.medicoGateway = medicoGateway;
  }

  // Medicos

  async obterInformacoesMedico(cpf: string) {
    return await this.medicoGateway.buscarMedicoPorCpf(cpf);
  }

  async listarMedicos() {
    return await this.medicoGateway.listarMedicos();
  }

  async atualizarInformacoesMedico(cpf: string, novasInformacoes: Partial<Usuario>) {
    return await this.medicoGateway.atualizarMedico({cpf, ...novasInformacoes});
  }

  async excluirMedico(cpf: string) {
    return await this.medicoGateway.deletarMedico(cpf);
  }

  // Pacientes

  async obterInformacoesPaciente(cpf: string) {
    return await this.pacienteGateway.buscarPacientePorCpf(cpf);
  }

  async listarPacientes() {
    return await this.pacienteGateway.listarPacientes();
  }

  async atualizarInformacoesPaciente(cpf: string, novasInformacoes: Partial<Usuario>) {
    return await this.pacienteGateway.atualizarPaciente({cpf, ...novasInformacoes});
  }

  async excluirPaciente(cpf: string) {
    return await this.pacienteGateway.deletarPaciente(cpf);
  }
}