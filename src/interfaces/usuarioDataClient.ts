interface DataClient<T> {
    cadastrarUsuario(usuario: T): Promise<T>;
    buscarUsuarioPorUsername(username: string): Promise<T>;
    atualizarUsuario(usuario: T): Promise<T>;
    deletarUsuario(username: string): Promise<boolean>;
}