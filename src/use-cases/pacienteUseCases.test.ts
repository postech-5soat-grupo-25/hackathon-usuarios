import { expect, test, describe, mock } from "bun:test";
import { PacienteUseCases } from "./pacienteUseCases";
import { mockMedicoGateway, mockPacienteGateway } from "./__mocks__/gateways";

describe("Caso de uso: Paciente", () => {
  const pacienteUseCases = new PacienteUseCases(
    mockPacienteGateway,
    mockMedicoGateway
  );

  test("obter informações do paciente logado", async () => {
    const username = "username";
    await pacienteUseCases.obterInformacoesPacienteLogado(username);

    expect(mockPacienteGateway.buscarPacientePorUsername).toHaveBeenCalledWith(username);
  });

  test("obter informações do médico", async () => {
    const username = "username";
    await pacienteUseCases.obterInformacoesMedico(username);

    expect(mockMedicoGateway.buscarMedicoPorUsername).toHaveBeenCalledWith(username);
  });

  test("atualizar informações do paciente logado", async () => {
    const username = "username";
    const novasInformacoes = { nome: "Novo nome" };
    await pacienteUseCases.atualizarInformacoesPacienteLogado(username, novasInformacoes);

    expect(mockPacienteGateway.atualizarPaciente).toHaveBeenCalledWith({ username, ...novasInformacoes });
  });

  test("excluir conta do paciente logado", async () => {
    const username = "username";
    await pacienteUseCases.excluirContaPacienteLogado(username);

    expect(mockPacienteGateway.deletarPaciente).toHaveBeenCalledWith(username);
  });
});