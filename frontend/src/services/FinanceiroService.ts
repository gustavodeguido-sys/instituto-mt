import { api } from '@/lib/api'
import type { NovoLancamento, PainelFinanceiro } from '@/types/financeiro'

// Todos os números da tela Financeiro para o mês ('AAAA-MM').
export async function buscarPainelFinanceiro(mes: string): Promise<PainelFinanceiro | null> {
  return api<PainelFinanceiro>(`/financeiro?mes=${mes}`)
}

// Registra uma arrecadação ou despesa (modal "Novo lançamento").
// O backend responde 201 sem corpo, por isso o retorno é void.
export async function registrarLancamento(dados: NovoLancamento): Promise<void> {
  await api<void>('/financeiro/lancamentos', { method: 'POST', body: JSON.stringify(dados) })
}

// Baixa a planilha (CSV) do mês.
// Aqui NÃO usamos o wrapper api(): ele lê a resposta como JSON, e o que vem é um arquivo.
// Usamos fetch + blob em vez de window.location.href porque assim:
//  - o await só termina quando o download acaba (o botão mostra "exportando" de verdade);
//  - um erro do backend vira exceção, em vez de levar a página para uma tela de erro;
//  - quando houver JWT, dá para enviar o cabeçalho Authorization (o href não envia).
export async function exportarFinanceiro(mes: string): Promise<void> {
  const res = await fetch(`/api/financeiro/exportar?mes=${mes}`)
  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao exportar o financeiro`)
  }

  // blob: o corpo da resposta como "arquivo em memória".
  const arquivo = await res.blob()
  // createObjectURL dá um endereço temporário para esse blob; um <a download>
  // apontando para ele, clicado via código, dispara o "salvar arquivo" do navegador.
  const url = URL.createObjectURL(arquivo)
  const link = document.createElement('a')
  link.href = url
  link.download = `financeiro-${mes}.csv`
  link.click()
  // Libera a memória do blob depois que o clique já foi processado.
  URL.revokeObjectURL(url)
}
