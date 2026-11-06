export interface Hospedagem {
    id: string;
    paciente: string;
    acompanhante: string;
    quarto: string;
    dataEntrada: string;
    dataSaida: string | null;
}

export interface ProximaHospedagem {
    id: string;
    paciente: string;
    quarto: string;
    dataPrevista: string;
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
  proximasHospedagens: ProximaHospedagem[];
}
