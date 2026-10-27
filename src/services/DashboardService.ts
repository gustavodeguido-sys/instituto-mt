import type { ResumoDashboard } from "@/types/dashboard";

// Ainda não há backend: null significa "sem dados" e a página mostra
// os cards e listas vazios. Quando a API existir, trocar por um fetch
// que devolva o ResumoDashboard.
export async function buscarResumo(): Promise<ResumoDashboard | null> {
    return null
}
