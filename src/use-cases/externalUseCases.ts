import { Usuario } from "../entities/usuario";
import { MedicoGateway, MedicoInput } from "../interfaces/medicoGateway";
import { PacienteGateway, PacienteInput } from "../interfaces/pacienteGateway";

export class ExternalUseCases {
  private pacienteGateway: PacienteGateway;
  private medicoGateway: MedicoGateway;

  constructor(pacienteGateway: PacienteGateway, medicoGateway: MedicoGateway) {
    this.pacienteGateway = pacienteGateway;
    this.medicoGateway = medicoGateway;
  }

  async cadastrarPaciente(paciente: PacienteInput): Promise<Usuario> {
    return await this.pacienteGateway.cadastrarPaciente(paciente);
  }

  async cadastrarMedico(medico: MedicoInput): Promise<Usuario> {
    return await this.medicoGateway.cadastrarMedico(medico);
  }
}