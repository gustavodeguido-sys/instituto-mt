// Funções de formatação usadas nas telas de relatórios.
// As datas chegam como 'AAAA-MM-DD' e os meses como 'AAAA-MM'.
// As funções de mês ficam em @/lib/mes porque o financeiro também usa.
import { mesAtual } from '@/lib/mes'

export { mesAtual, nomeDoMes, ultimosMeses } from '@/lib/mes'

function hojeIso() {
  const hoje = new Date()
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${mesAtual()}-${dia}`
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
