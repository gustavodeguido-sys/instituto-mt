export interface Hospedagem {
    id: string;
    paciente: string;
    acompanhante: string;
    quarto: string;
    dataEntrada: string;
    dataSaida: string | null;
}

export interface ResumoDashboard {
  hospedadosAgora: number;
  pacientesHospedados: number;
  acompanhantes: number;
  capacidadeTotal: number;
  vagasLivres: number;
  ocupacaoPercentual: number;
  checkinsHoje: number;
  hospedagens: Hospedagem[];
}