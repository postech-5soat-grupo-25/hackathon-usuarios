import { Usuario } from "../entities/usuario";

type AdminInput = Omit<Usuario, "crm"> & { senha: string, confirmacaoSenha: string };

export interface AdminGateway {
  cadastrarAdmin(admin: AdminInput): Promise<Usuario>;
  buscarAdminPorCpf(cpf: string): Promise<Usuario>;
  atualizarAdmin(admin: AdminInput): Promise<Usuario>;
  deletarAdmin(cpf: string): Promise<boolean>;
}