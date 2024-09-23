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

  async obterInformacoesMedico(username: string) {
    return await this.medicoGateway.buscarMedicoPorUsername(username);
  }

  async listarMedicos() {
    return await this.medicoGateway.listarMedicos();
  }

  async atualizarInformacoesMedico(username: string, novasInformacoes: Partial<Usuario>) {
    return await this.medicoGateway.atualizarMedico({username, ...novasInformacoes});
  }

  async excluirMedico(username: string) {
    return await this.medicoGateway.deletarMedico(username);
  }

  // Pacientes

  async obterInformacoesPaciente(username: string) {
    return await this.pacienteGateway.buscarPacientePorUsername(username);
  }

  async listarPacientes() {
    return await this.pacienteGateway.listarPacientes();
  }

  async atualizarInformacoesPaciente(username: string, novasInformacoes: Partial<Usuario>) {
    return await this.pacienteGateway.atualizarPaciente({username, ...novasInformacoes});
  }

  async excluirPaciente(username: string) {
    return await this.pacienteGateway.deletarPaciente(username);
  }
}