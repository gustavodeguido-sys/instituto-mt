import type { Hospede, ResumoHospedes } from '@/types/hospedes'

// Ainda não há backend: as funções retornam dados vazios para a tela
// renderizar o estado vazio. Quando a API existir, basta trocar o corpo
// por um fetch (ex.: fetch('/api/hospedes')) mantendo as mesmas assinaturas.

export async function buscarHospedes(): Promise<Hospede[]> {
  return []
}

export async function buscarResumoHospedes(): Promise<ResumoHospedes> {
  return {
    hospedadosAgora: 0,
    capacidadeTotal: 0,
    pacientes: 0,
    preTransplante: 0,
    posTransplante: 0,
    internadosHc: 0,
    acompanhantes: 0,
    pacientesSemAcompanhante: 0,
    vagasLivres: 0,
    saidasPrevistasSemana: 0,
  }
}
