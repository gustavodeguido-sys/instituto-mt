import type {
  ArquivoRelatorio,
  CategoriaId,
  CategoriaRelatorio,
  NovoRelatorio,
} from '@/types/categorias'

// Ainda não há backend: as funções retornam listas vazias para as telas
// renderizarem o estado vazio. Quando a API existir, basta trocar o corpo
// por um fetch mantendo as mesmas assinaturas.

// Contagem, última atualização e selo de cada categoria no mês ('AAAA-MM').
export async function buscarResumoCategorias(mes: string): Promise<CategoriaRelatorio[]> {
  void mes // ex.: fetch(`/api/relatorios/categorias?mes=${mes}`)
  return []
}

// Últimos arquivos gerados, de qualquer categoria (tabela do hub).
export async function buscarRelatoriosRecentes(limite = 5): Promise<ArquivoRelatorio[]> {
  void limite // ex.: fetch(`/api/relatorios?limite=${limite}`)
  return []
}

// Arquivos do mês; sem categoria, devolve os de todas.
export async function buscarRelatorios(
  mes: string,
  categoria?: CategoriaId,
): Promise<ArquivoRelatorio[]> {
  void mes
  void categoria // ex.: fetch(`/api/relatorios?mes=${mes}&categoria=${categoria}`)
  return []
}

// Pede ao backend para gerar um novo arquivo de relatório.
export async function gerarRelatorio(dados: NovoRelatorio): Promise<void> {
  void dados // ex.: fetch('/api/relatorios', { method: 'POST', body: JSON.stringify(dados) })
}
