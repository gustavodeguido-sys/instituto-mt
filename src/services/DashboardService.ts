import type { ResumoDashboard } from "@/types/dashboard";

export async function buscarResumo(): Promise<ResumoDashboard> {
    return {
        hospedadosAgora: 38,
        pacientesHospedados: 24,
        acompanhantes: 14,
        capacidadeTotal: 45,
        vagasLivres: 7,
        ocupacaoPercentual: 84,
        checkinsHoje: 3,

        hospedagens: [
            {
            id: "1",
            paciente: "Felipe Souza",
            acompanhante: "Ana Elisa",
            quarto: "2",
            dataEntrada: "10/04/2026",
            dataSaida: null,
            },
            {
                id: "2",
                paciente: "Guilherme Peixoto",
                acompanhante: "Ana",
                quarto: "1",
                dataEntrada: "19/10/2026",
                dataSaida: null,
            }

        ]   
     }
    
}