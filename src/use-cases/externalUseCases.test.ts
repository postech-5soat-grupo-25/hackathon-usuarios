import { expect, test, describe, mock } from "bun:test";
import { ExternalUseCases } from "./externalUseCases";
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

describe("Caso de uso: External", () => {
  const externalUseCases = new ExternalUseCases(
    mockPacienteGateway,
    mockMedicoGateway
  );

  test("cadastrar paciente", async () => {
    const input: PacienteInput = UsuarioCreateInputSchema.parse({
      nome: "Paciente",
      username: "username",
      email: "paciente@email.com",
      cpf: "350.933.020-07",
      tipo: "paciente",
      senha: "senha",
      confirmacaoSenha: "senha",
    });
    await externalUseCases.cadastrarPaciente(input);

    expect(mockPacienteGateway.cadastrarPaciente).toHaveBeenCalledWith(input);
  });

  test("cadastrar médico", async () => {
    const input = UsuarioCreateInputSchema.parse({
      nome: "Paciente",
      username: "username",
      email: "paciente@email.com",
      cpf: "350.933.020-07",
      crm: "1234567",
      tipo: "paciente",
      senha: "senha",
      confirmacaoSenha: "senha",
    }) as MedicoInput;
    await externalUseCases.cadastrarMedico(input);

    expect(mockMedicoGateway.cadastrarMedico).toHaveBeenCalledWith(input);
  });
});
