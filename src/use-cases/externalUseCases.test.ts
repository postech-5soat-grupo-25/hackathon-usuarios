import { expect, test, describe, mock } from "bun:test";
import { ExternalUseCases } from "./externalUseCases";
import { PacienteInput } from "../interfaces/pacienteGateway";
import { MedicoInput } from "../interfaces/medicoGateway";
import { UsuarioCreateInputSchema } from "../entities/usuario";

import { mockMedicoGateway, mockPacienteGateway } from "./__mocks__/gateways";

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
