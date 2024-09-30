import { expect, test, describe, mock, beforeEach, Mock } from "bun:test";
import { CognitoClient } from "./cognitoClient";
import { UsuarioCreateInputSchema } from "../entities/usuario";

import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

mock.module("@aws-sdk/client-cognito-identity-provider", () => ({
  CognitoIdentityProviderClient: mock(),
  AdminGetUserCommand: mock(),
  AdminCreateUserCommand: mock(),
  AdminDeleteUserCommand: mock(),
  AdminUpdateUserAttributesCommand: mock(),
  AdminListGroupsForUserCommand: mock(),
  AdminAddUserToGroupCommand: mock(),
  ListUsersInGroupCommand: mock(),
}));

describe("Adapter: Cognito Client", () => {
  const cognitoClientMedico = new CognitoClient('user_pool_id', 'medico');
  const mockSendMedico = mock();
  // @ts-ignore
  cognitoClientMedico.client = {send: mockSendMedico};

  const cognitoClientPaciente = new CognitoClient('user_pool_id', 'paciente');
  const mockSendPaciente = mock();
  // @ts-ignore
  cognitoClientPaciente.client = {send: mockSendPaciente};

  const successResponse = (mockSend: Mock<any>) => {
    mockSend.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
    });
  }

  beforeEach(() => {
    mockSendMedico.mockClear();
  });

  test("Cria paciente e busca info do usuário", async () => {
    const pacienteInput = UsuarioCreateInputSchema.parse({
      nome: "Paciente",
      username: "username",
      email: "paciente@email.com",
      cpf: "350.933.020-07",
      tipo: "paciente",
      senha: "senha",
      confirmacaoSenha: "senha",
    });

    // Criação do usuário
    successResponse(mockSendPaciente);

    // Adição do usuário ao grupo
    successResponse(mockSendPaciente);

    // Confirma a conta de usuario
    successResponse(mockSendPaciente);

    // Define a senha do usuário
    successResponse(mockSendPaciente);

    // Busca info do usuário criado
    mockSendPaciente.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
      Username: 'username',
      UserAttributes: [
        { Name: 'name', Value: 'Paciente' },
        { Name: 'email', Value: 'paciente@email.com' },
        { Name: 'custom:cpf', Value: '350.933.020-07' },
        { Name: 'custom:tipo', Value: 'paciente' },
      ],
    });

    // Verifica os grupos do usuário
    mockSendPaciente.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
      Groups: [
        { GroupName: 'Pacientes' },
      ],
    });

    const paciente = await cognitoClientPaciente.createUser(pacienteInput);

    expect(paciente).toEqual({
      nome: "Paciente",
      username: "username",
      email: "paciente@email.com",
      cpf: "350.933.020-07",
      tipo: "paciente",
    });

    expect(mockSendPaciente).toHaveBeenCalledTimes(6);
    expect(mockSendPaciente).toHaveBeenCalledWith(
      new AdminCreateUserCommand({
        UserPoolId: 'user_pool_id',
        Username: 'username',
        UserAttributes: [
          { Name: 'name', Value: 'Paciente' },
          { Name: 'email', Value: 'paciente@email.com' },
          { Name: 'custom:cpf', Value: '350.933.020-07' },
          { Name: 'custom:tipo', Value: 'paciente' },
        ],
        TemporaryPassword: 'senha',
      })
    );

    expect(mockSendPaciente).toHaveBeenCalledWith(
      new AdminAddUserToGroupCommand({
        UserPoolId: 'user_pool_id',
        Username: 'username',
        GroupName: 'Pacientes',
      })
    );
  });

  test("Cria medico e busca info do usuário", async () => {
    const medicoInput = UsuarioCreateInputSchema.parse({
      nome: "Medico",
      username: "username",
      email: "medico@email.com",
      cpf: "350.933.020-07",
      crm: "1234567",
      tipo: "medico",
      senha: "senha",
      confirmacaoSenha: "senha",
    });

    // Criação do usuário
    successResponse(mockSendMedico);

    // Adição do usuário ao grupo
    successResponse(mockSendMedico);

    // Confirma a conta de usuario
    successResponse(mockSendMedico);

    // Define a senha do usuário
    successResponse(mockSendMedico);

    // Busca info do usuário criado
    mockSendMedico.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
      Username: 'username',
      UserAttributes: [
        { Name: 'name', Value: 'Medico' },
        { Name: 'email', Value: 'medico@email.com' },
        { Name: 'custom:cpf', Value: '350.933.020-07' },
        { Name: 'custom:crm', Value: '1234567' },
      ],
    });

    // Verifica os grupos do usuário
    mockSendMedico.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
      Groups: [
        { GroupName: 'Medicos' },
      ],
    });

    const medico = await cognitoClientMedico.createUser(medicoInput);

    expect(medico).toEqual({
      nome: "Medico",
      username: "username",
      email: "medico@email.com",
      cpf: "350.933.020-07",
      crm: "1234567",
      tipo: "medico",
    });

    expect(mockSendMedico).toHaveBeenCalledTimes(6);
    expect(mockSendMedico).toHaveBeenCalledWith(
      new AdminCreateUserCommand({
        UserPoolId: 'user_pool_id',
        Username: 'username',
        UserAttributes: [
          { Name: 'name', Value: 'Medico' },
          { Name: 'email', Value: 'medico@email.com' },
          { Name: 'custom:cpf', Value: '350.933.020-07' },
          { Name: 'custom:tipo', Value: 'medico' },
        ],
        TemporaryPassword: 'senha',
      })
    );

    expect(mockSendMedico).toHaveBeenCalledWith(
      new AdminAddUserToGroupCommand({
        UserPoolId: 'user_pool_id',
        Username: 'username',
        GroupName: 'Medicos',
      })
    );
  });

  test("Deleta usuário", async () => {
    successResponse(mockSendMedico);

    await cognitoClientMedico.deleteUser('username');

    expect(mockSendMedico).toHaveBeenCalledTimes(1);
    expect(mockSendMedico).toHaveBeenCalledWith(
      new AdminDeleteUserCommand({
        UserPoolId: 'user_pool_id',
        Username: 'username',
      })
    );
  });

  test("Atualiza usuário", async () => {

    // Update the user
    successResponse(mockSendPaciente);

    // Busca info do usuário criado
    mockSendPaciente.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
      Username: 'username_2',
      UserAttributes: [
        { Name: 'name', Value: 'Novo Nome' },
        { Name: 'email', Value: 'novo@email.com' },
        { Name: 'custom:cpf', Value: '350.933.020-07' },
        { Name: 'custom:tipo', Value: 'paciente' },
      ],
    });

    // Verifica os grupos do usuário
    mockSendPaciente.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
      Groups: [
        { GroupName: 'Pacientes' },
      ],
    });

    await cognitoClientPaciente.updateUserAttributes({
      username: 'username_2',
      nome: 'Novo Nome',
    });

    expect(mockSendPaciente).toHaveBeenCalledWith(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: 'user_pool_id',
        Username: 'username_2',
        UserAttributes: [
          { Name: 'name', Value: 'Novo nome' },
        ],
      })
    );
  });

  test("Busca usuários", async () => {
    mockSendMedico.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
      Users: [
        {
          Username: 'username',
          Attributes: [
            { Name: 'name', Value: 'Medico' },
            { Name: 'email', Value: 'medico@email.com' },
            { Name: 'custom:cpf', Value: '350.933.020-07' },
            { Name: 'custom:crm', Value: '1234567' },
          ],
        },
      ],
    });

    const users = await cognitoClientMedico.listUsers();

    expect(users).toEqual([
      {
        nome: "Medico",
        username: "username",
        email: "medico@email.com",
        cpf: "350.933.020-07",
        crm: "1234567",
        tipo: "medico",
      },
    ]);
  });
});
