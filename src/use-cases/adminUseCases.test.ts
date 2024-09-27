import { expect, test, describe, mock } from "bun:test";
import { AdminUseCases } from "./adminUseCases";
import { PacienteGateway } from "../interfaces/pacienteGateway";
import { MedicoGateway } from "../interfaces/medicoGateway";

const mockPacienteGateway: PacienteGateway = {
  buscarPacientePorUsername: mock() as PacienteGateway["buscarPacientePorUsername"],
  listarPacientes: mock() as PacienteGateway["listarPacientes"],
  atualizarPaciente: mock() as PacienteGateway["atualizarPaciente"],
  deletarPaciente: mock() as PacienteGateway["deletarPaciente"],
  cadastrarPaciente: mock() as PacienteGateway["cadastrarPaciente"],
};

const mockMedicoGateway: MedicoGateway = {
  buscarMedicoPorUsername: mock() as MedicoGateway["buscarMedicoPorUsername"],
  listarMedicos: mock() as MedicoGateway["listarMedicos"],
  atualizarMedico: mock() as MedicoGateway["atualizarMedico"],
  deletarMedico: mock() as MedicoGateway["deletarMedico"],
  cadastrarMedico: mock() as MedicoGateway["cadastrarMedico"],
};

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