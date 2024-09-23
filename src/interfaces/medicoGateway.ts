import { Usuario, UsuarioCreateInput } from "../entities/usuario"

export type MedicoInput = Required<UsuarioCreateInput>;
export type MedicoUpdateInput = Partial<UsuarioCreateInput>;

export interface MedicoGateway {
  cadastrarMedico(medico: MedicoInput): Promise<Usuario>;
  buscarMedicoPorCpf(cpf: string): Promise<Usuario | null>;
  listarMedicos(): Promise<Usuario[]>;
  atualizarMedico(medico: MedicoUpdateInput): Promise<Usuario>;
  deletarMedico(cpf: string): Promise<boolean>;
}