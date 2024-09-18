import { Usuario, UsuarioSchema } from "../entities/usuario"

export type MedicoInput = Required<Usuario> & { senha: string, confirmacaoSenha: string };
export type MedicoUpdateInput = Partial<Usuario>;

export interface MedicoGateway {
  cadastrarMedico(medico: MedicoInput): Promise<Usuario>;
  buscarMedicoPorCpf(cpf: string): Promise<Usuario>;
  atualizarMedico(medico: MedicoUpdateInput): Promise<Usuario>;
  deletarMedico(cpf: string): Promise<boolean>;
}