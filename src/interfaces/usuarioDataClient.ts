interface DataClient<T> {
    cadastrarUsuario(usuario: T): Promise<T>;
    buscarUsuarioPorCpf(cpf: string): Promise<T>;
    atualizarUsuario(usuario: T): Promise<T>;
    deletarUsuario(cpf: string): Promise<boolean>;
}