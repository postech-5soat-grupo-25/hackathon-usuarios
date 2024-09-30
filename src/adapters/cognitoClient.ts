import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminListGroupsForUserCommand,
  AdminAddUserToGroupCommand,
  ListUsersInGroupCommand,
  AdminSetUserPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {
  Usuario,
  UsuarioCreateInput,
  UsuarioSchema,
} from "../entities/usuario";
import { UsuarioUpdateInput } from "../api/schema/usuarioSchema";

const usuarioXcognito = {
  nome: "name",
  email: "email",
  cpf: "custom:cpf",
  crm: "custom:crm",
};

const tipoXgroup = {
  medico: "Medicos",
  paciente: "Pacientes",
};

const parse_cognito_to_usuario =
  (userType: "medico" | "paciente") => (user: any) => {
    const attributes = user.Attributes || user.UserAttributes || [];
    const userAttributes = attributes.reduce((acc: any, attribute: any) => {
      acc[attribute.Name] = attribute.Value;
      return acc;
    }, {});
    return UsuarioSchema.parse({
      nome: userAttributes[usuarioXcognito.nome],
      username: user.Username,
      email: userAttributes[usuarioXcognito.email],
      cpf: userAttributes[usuarioXcognito.cpf] ?? "09785545660",
      crm: userAttributes[usuarioXcognito.crm],
      tipo: userType,
    });
  };

export class CognitoClient {
  client: CognitoIdentityProviderClient;
  userPoolId: string;
  userType: "medico" | "paciente";
  userGroup: "Medicos" | "Pacientes";

  constructor(userPoolId: string, userType: "medico" | "paciente") {
    this.client = new CognitoIdentityProviderClient();
    this.userType = userType;
    this.userGroup = tipoXgroup[userType] as "Medicos" | "Pacientes";
    this.userPoolId = userPoolId;
  }

  async getUser(username: string): Promise<Usuario | null> {
    const command = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });
    const cognitoResponse = await this.client.send(command);
    if (
      !cognitoResponse.$metadata.httpStatusCode ||
      cognitoResponse.$metadata.httpStatusCode !== 200
    ) {
      return null;
    }
    const groupsCommand = new AdminListGroupsForUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });
    const groupsResponse = await this.client.send(groupsCommand);
    const groups = groupsResponse.Groups || [];
    if (!groups.find((group) => group.GroupName === this.userGroup)) {
      return null;
    }
    return parse_cognito_to_usuario(this.userType)(cognitoResponse);
  }

  async createUser(userInput: UsuarioCreateInput): Promise<Usuario | null> {
    const UserAttributes = []

    for (const key in userInput) {
      if (Object(usuarioXcognito).hasOwnProperty(key)) {
        UserAttributes.push({
          Name: usuarioXcognito[key as keyof typeof usuarioXcognito] as string,
          Value: userInput[key as keyof typeof usuarioXcognito],
        });
      }
    }

    const command = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: userInput.username,
      UserAttributes,
      TemporaryPassword: userInput.senha,
      MessageAction: "SUPPRESS", // Evita o envio do e-mail de verificação
    });
    const cognitoResponse = await this.client.send(command);

    if (
      !cognitoResponse.$metadata.httpStatusCode ||
      cognitoResponse.$metadata.httpStatusCode !== 200
    ) {
      return null;
    }

    const addGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: this.userPoolId,
      Username: userInput.username,
      GroupName: this.userGroup,
    });

    const addGroupResponse = await this.client.send(addGroupCommand);

    if (
      !addGroupResponse.$metadata.httpStatusCode ||
      addGroupResponse.$metadata.httpStatusCode !== 200
    ) {
      return null;
    }

     // Confirmar manualmente o usuário
     const confirmCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: userInput.username,
      UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
    });
    const confirmResponse = await this.client.send(confirmCommand);

    if (
      !confirmResponse.$metadata.httpStatusCode ||
      confirmResponse.$metadata.httpStatusCode !== 200
    ) {
      return null;
    }

    // Definir a senha como permanente
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: userInput.username,
      Password: userInput.senha,
      Permanent: true, // Marca a senha como permanente
    });
    const setPasswordResponse = await this.client.send(setPasswordCommand);

    if (
      !setPasswordResponse.$metadata.httpStatusCode ||
      setPasswordResponse.$metadata.httpStatusCode !== 200
    ) {
      return null;
    }

    return this.getUser(userInput.username!);
  }

  async deleteUser(username: string): Promise<boolean> {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });
    const cognitoResponse = await this.client.send(command);
    if (
      !cognitoResponse.$metadata.httpStatusCode ||
      cognitoResponse.$metadata.httpStatusCode !== 200
    ) {
      return false;
    }
    return true;
  }

  async updateUserAttributes(
    usuarioUpdate: UsuarioUpdateInput
  ): Promise<Usuario | null> {
    if (!usuarioUpdate.username) {
      return null;
    }

    const UserAttributes = []

    for (const key in usuarioUpdate) {
      if (Object(usuarioXcognito).hasOwnProperty(key)) {
        UserAttributes.push({
          Name: usuarioXcognito[key as keyof typeof usuarioXcognito] as string,
          Value: usuarioUpdate[key as keyof typeof usuarioXcognito],
        });
      }
    }

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: usuarioUpdate.username,
      UserAttributes,
    });
    const cognitoResponse = await this.client.send(command);
    if (
      !cognitoResponse.$metadata.httpStatusCode ||
      cognitoResponse.$metadata.httpStatusCode !== 200
    ) {
      return null;
    }
    return this.getUser(usuarioUpdate.username);
  }

  async listUsers(): Promise<Usuario[]> {
    const command = new ListUsersInGroupCommand({
      UserPoolId: this.userPoolId,
      GroupName: this.userGroup,
    });
    const cognitoResponse = await this.client.send(command);
    const raw = cognitoResponse.Users || [];
    return raw.map(parse_cognito_to_usuario(this.userType));
  }
}
