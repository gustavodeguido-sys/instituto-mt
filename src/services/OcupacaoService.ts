import type { OcupacaoResumo } from "@/types/ocupacao";

// Ainda não há backend: null deixa a barra de ocupação vazia.
// Quando a API existir, trocar por um fetch que devolva o OcupacaoResumo.
export async function buscarResumoOcupacao(): Promise<OcupacaoResumo | null> {
    return null
}
