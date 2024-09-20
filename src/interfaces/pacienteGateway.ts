import { Usuario, UsuarioCreateInput } from "../entities/usuario";

export type PacienteInput = Omit<UsuarioCreateInput, "crm">;
export type PacienteUpdateInput = Partial<UsuarioCreateInput>;

export interface PacienteGateway {
  cadastrarPaciente(paciente: PacienteInput): Promise<Usuario>;
  buscarPacientePorCpf(cpf: string): Promise<Usuario | null>;
  atualizarPaciente(paciente: PacienteUpdateInput): Promise<Usuario>;
  deletarPaciente(cpf: string): Promise<boolean>;
}