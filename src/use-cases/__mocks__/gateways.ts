import { mock } from "bun:test";
import { PacienteGateway } from "../../interfaces/pacienteGateway";
import { MedicoGateway } from "../../interfaces/medicoGateway";

export const mockPacienteGateway: PacienteGateway = {
  buscarPacientePorUsername:
    mock() as PacienteGateway["buscarPacientePorUsername"],
  listarPacientes: mock() as PacienteGateway["listarPacientes"],
  atualizarPaciente: mock() as PacienteGateway["atualizarPaciente"],
  deletarPaciente: mock() as PacienteGateway["deletarPaciente"],
  cadastrarPaciente: mock() as PacienteGateway["cadastrarPaciente"],
};

export const mockMedicoGateway: MedicoGateway = {
  buscarMedicoPorUsername: mock() as MedicoGateway["buscarMedicoPorUsername"],
  listarMedicos: mock() as MedicoGateway["listarMedicos"],
  atualizarMedico: mock() as MedicoGateway["atualizarMedico"],
  deletarMedico: mock() as MedicoGateway["deletarMedico"],
  cadastrarMedico: mock() as MedicoGateway["cadastrarMedico"],
};