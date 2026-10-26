import type { OcupacaoResumo } from "@/types/ocupacao";

export async function buscarResumoOcupacao(): Promise<OcupacaoResumo> {
    return {
        pacientes: 2,
        acompanhantes: 2,
        vagasLivres: 8,
    }
}