import { Usuario, UsuarioCreateInput } from "../entities/usuario"

export type MedicoInput = Required<UsuarioCreateInput>;
export type MedicoUpdateInput = Partial<UsuarioCreateInput>;

export interface MedicoGateway {
  cadastrarMedico(medico: MedicoInput): Promise<Usuario>;
  buscarMedicoPorUsername(username: string): Promise<Usuario | null>;
  listarMedicos(): Promise<Usuario[]>;
  atualizarMedico(medico: MedicoUpdateInput): Promise<Usuario | null>;
  deletarMedico(username: string): Promise<boolean>;
}