import { expect, test, describe, mock, beforeEach, } from "bun:test";
import { CognitoClient } from "./cognitoClient";
import { UsuarioCreateInputSchema } from "../entities/usuario";

class MockCognitoIdentityProviderClient {
  constructor() {}
}

import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminListGroupsForUserCommand,
  AdminAddUserToGroupCommand,
  ListUsersInGroupCommand
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

const bla = mock();

describe("Adapter: Cognito Client", () => {
  const cognitoClientMedico = new CognitoClient('user_pool_id', 'medico');
  const mockSendMedico = mock();
  // @ts-ignore
  cognitoClientMedico.client = {send: mockSendMedico};

  const cognitoClientPaciente = new CognitoClient('user_pool_id', 'paciente');
  const mockSendPaciente = mock();
  // @ts-ignore
  cognitoClientPaciente.client = {send: mockSendPaciente};

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
    mockSendPaciente.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
    });

    // Adição do usuário ao grupo
    mockSendPaciente.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
    });

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

    expect(mockSendPaciente).toHaveBeenCalledTimes(4);
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
    mockSendMedico.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
    });

    // Adição do usuário ao grupo
    mockSendMedico.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
    });

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

    expect(mockSendMedico).toHaveBeenCalledTimes(4);
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
    mockSendMedico.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
    });

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
    mockSendPaciente.mockResolvedValueOnce({
      '$metadata': {
        httpStatusCode: 200,
      },
    });

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

    await cognitoClientPaciente.updateUserAttributes({
      username: 'username',
      nome: 'Novo nome',
    });

    expect(mockSendPaciente).toHaveBeenCalledWith(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: 'user_pool_id',
        Username: 'username',
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
