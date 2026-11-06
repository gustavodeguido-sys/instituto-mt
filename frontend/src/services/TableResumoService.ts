import type { TableResumo } from '@/types/tableresumo';

export async function buscarResumoTabela(): Promise<TableResumo[]> {
    return [
        {
            paciente: "Felipe Souza",
            acompanhante: "Ana Elisa",
            quarto: "2",
            dataEntrada: "10/04/2026",
            situacao: "Hospedado"
        },
        {
            paciente: "Guilherme Peixoto",
            acompanhante: "Ana",
            quarto: "1",
            dataEntrada: "19/10/2026",
            situacao: "Hospedado"
        }
    ]
}