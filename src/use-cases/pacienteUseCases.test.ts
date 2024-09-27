import { expect, test, describe, mock } from "bun:test";
import { PacienteUseCases } from "./pacienteUseCases";
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