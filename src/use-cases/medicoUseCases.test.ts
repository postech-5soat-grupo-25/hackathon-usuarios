import { expect, test, describe, mock } from "bun:test";
import { MedicoUseCases } from "./medicoUseCases";
import { PacienteGateway, PacienteInput } from "../interfaces/pacienteGateway";
import { MedicoGateway, MedicoInput } from "../interfaces/medicoGateway";
import { UsuarioCreateInputSchema } from "../entities/usuario";

const mockPacienteGateway: PacienteGateway = {
  buscarPacientePorUsername:
    mock() as PacienteGateway["buscarPacientePorUsername"],
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
