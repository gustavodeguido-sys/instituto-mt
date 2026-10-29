// Funções de formatação usadas nas telas de relatórios.
// As datas chegam como 'AAAA-MM-DD' e os meses como 'AAAA-MM'.

export function mesAtual() {
  const hoje = new Date()
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
}

function hojeIso() {
  const hoje = new Date()
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${mesAtual()}-${dia}`
}

// '2026-10' -> 'Outubro de 2026'
export function nomeDoMes(mes: string) {
  const [ano, numero] = mes.split('-').map(Number)
  const nome = new Date(ano, numero - 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

// Os últimos `quantidade` meses, do mais recente para o mais antigo.
export function ultimosMeses(quantidade = 12) {
  const hoje = new Date()
  return Array.from({ length: quantidade }, (_, i) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i)
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
  })
}

// '2026-10-19' -> '19/10' (cortando a string para não sofrer com fuso horário)
export function formatarDiaMes(data: string) {
  const [, mes, dia] = data.split('-')
  return `${dia}/${mes}`
}

// Rodapé do card: 'atualizado hoje', 'atualizado 18/10' ou 'sem atualização'.
export function formatarAtualizacao(data: string | null) {
  if (!data) return 'sem atualização'
  if (data === hojeIso()) return 'atualizado hoje'
  return `atualizado ${formatarDiaMes(data)}`
}

export function formatarPeriodo(inicio: string, fim: string) {
  return `${formatarDiaMes(inicio)} – ${formatarDiaMes(fim)}`
}
