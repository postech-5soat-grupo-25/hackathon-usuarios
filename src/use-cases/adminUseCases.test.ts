import { expect, test, describe, mock } from "bun:test";
import { AdminUseCases } from "./adminUseCases";
import { mockMedicoGateway, mockPacienteGateway } from "./__mocks__/gateways";

describe("Caso de uso: Admin", () => {
  const adminUseCases = new AdminUseCases(
    mockPacienteGateway,
    mockMedicoGateway,
  );

  test("listar médicos", async () => {
    await adminUseCases.listarMedicos();

    expect(mockMedicoGateway.listarMedicos).toHaveBeenCalled();
  });

  test("excluir médico", async () => {
    await adminUseCases.excluirMedico("username");

    expect(mockMedicoGateway.deletarMedico).toHaveBeenCalledWith("username");
  });

  test("obter informações do médico", async () => {
    await adminUseCases.obterInformacoesMedico("username");

    expect(mockMedicoGateway.buscarMedicoPorUsername).toHaveBeenCalledWith("username");
  });

  test("updateUser", async () => {
    await adminUseCases.atualizarInformacoesMedico("username", { nome: "new name" });

    expect(mockMedicoGateway.atualizarMedico).toHaveBeenCalledWith({ username: "username", nome: "new name" });
  });

  test("listUsers", async () => {
    await adminUseCases.listarPacientes();

    expect(mockPacienteGateway.listarPacientes).toHaveBeenCalled();
  });

  test("deleteUser", async () => {
    await adminUseCases.excluirPaciente("username");

    expect(mockPacienteGateway.deletarPaciente).toHaveBeenCalledWith("username");
  });

  test("getUser", async () => {
    await adminUseCases.obterInformacoesPaciente("username");

    expect(mockPacienteGateway.buscarPacientePorUsername).toHaveBeenCalledWith("username");
  });

  test("updateUser", async () => {
    await adminUseCases.atualizarInformacoesPaciente("username", { nome: "new name" });

    expect(mockPacienteGateway.atualizarPaciente).toHaveBeenCalledWith({ username: "username", nome: "new name" });
  });
});