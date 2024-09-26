import { Usuario, UsuarioCreateInput } from "../entities/usuario";

export type PacienteInput = Omit<UsuarioCreateInput, "crm">;
export type PacienteUpdateInput = Partial<UsuarioCreateInput>;

export interface PacienteGateway {
  cadastrarPaciente(paciente: PacienteInput): Promise<Usuario>;
  buscarPacientePorUsername(username: string): Promise<Usuario | null>;
  listarPacientes(): Promise<Usuario[]>;
  atualizarPaciente(paciente: PacienteUpdateInput): Promise<Usuario | null>;
  deletarPaciente(username: string): Promise<boolean>;
}