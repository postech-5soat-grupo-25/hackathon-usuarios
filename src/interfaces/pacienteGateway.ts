import { Usuario } from "../entities/usuario";

export type PacienteInput = Omit<Usuario, "crm"> & { senha: string, confirmacaoSenha: string };
export type PacienteUpdateInput = Partial<Usuario>;

export interface PacienteGateway {
  cadastrarPaciente(paciente: PacienteInput): Promise<Usuario>;
  buscarPacientePorCpf(cpf: string): Promise<Usuario>;
  atualizarPaciente(paciente: PacienteUpdateInput): Promise<Usuario>;
  deletarPaciente(cpf: string): Promise<boolean>;
}