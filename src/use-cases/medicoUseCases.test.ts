import { expect, test, describe } from "bun:test";
import { MedicoUseCases } from "./medicoUseCases";
import { mockMedicoGateway, mockPacienteGateway } from "./__mocks__/gateways";

describe("Caso de uso: Medico", () => {
  const medicoUseCases = new MedicoUseCases(
    mockPacienteGateway,
    mockMedicoGateway
  );

  test("obter informações do médico logado", async () => {
    const username = "username";
    await medicoUseCases.obterInformacoesMedicoLogado(username);

    expect(mockMedicoGateway.buscarMedicoPorUsername).toHaveBeenCalledWith(username);
  });

  test("obter informações do paciente", async () => {
    const username = "username";
    await medicoUseCases.obterInformacoesPaciente(username);

    expect(mockPacienteGateway.buscarPacientePorUsername).toHaveBeenCalledWith(username);
  });

  test("atualizar informações do médico logado", async () => {
    const username = "username";
    const novasInformacoes = { nome: "Novo nome" };
    await medicoUseCases.atualizarInformacoesMedicoLogado(username, novasInformacoes);

    expect(mockMedicoGateway.atualizarMedico).toHaveBeenCalledWith({ username, ...novasInformacoes });
  });

  test("excluir conta do médico logado", async () => {
    const username = "username";
    await medicoUseCases.excluirContaMedicoLogado(username);

    expect(mockMedicoGateway.deletarMedico).toHaveBeenCalledWith(username);
  });
});
