import { api } from '@/lib/api'
import type { Hospede, NovoHospede, ResumoHospedes } from '@/types/hospedes'

// Ainda não há backend: as funções retornam dados vazios para a tela
// renderizar o estado vazio. Quando a API existir, basta trocar o corpo
// por um fetch (ex.: fetch('/api/hospedes')) mantendo as mesmas assinaturas.

export async function buscarHospedes(): Promise<Hospede[]> {
  return api<Hospede[]>('/hospedes')
}

export async function buscarResumoHospedes(): Promise<ResumoHospedes> {
  return api<ResumoHospedes>('/hospedes/resumo')
}

export async function cadastrarHospede(dados: NovoHospede): Promise<Hospede> {
  return api<Hospede>('/hospedes', { method: 'POST', body: JSON.stringify(dados) })
}
