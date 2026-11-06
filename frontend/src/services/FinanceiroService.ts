import type { NovoLancamento, PainelFinanceiro } from '@/types/financeiro'

// Ainda não há backend: null significa "sem dados" e a página mostra
// os cards com "—" e as seções vazias. Quando a API existir, basta trocar
// o corpo por um fetch mantendo as mesmas assinaturas.

// Todos os números da tela Financeiro para o mês ('AAAA-MM').
export async function buscarPainelFinanceiro(mes: string): Promise<PainelFinanceiro | null> {
  void mes // ex.: fetch(`/api/financeiro?mes=${mes}`)
  return null
}

// Registra uma arrecadação ou despesa (modal "Novo lançamento").
export async function registrarLancamento(dados: NovoLancamento): Promise<void> {
  void dados // ex.: fetch('/api/financeiro/lancamentos', { method: 'POST', body: JSON.stringify(dados) })
}

// Pede ao backend a planilha do mês para download.
export async function exportarFinanceiro(mes: string): Promise<void> {
  void mes // ex.: window.location.href = `/api/financeiro/exportar?mes=${mes}`
}
