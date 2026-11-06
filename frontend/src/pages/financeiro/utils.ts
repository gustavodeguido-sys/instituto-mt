// Formatação usada na tela financeira. Os valores chegam em centavos.

const reais = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const reaisComCentavos = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

// 4235000 -> 'R$ 42.350'  |  com centavos: 'R$ 42.350,00'
export function formatarReais(centavos: number, comCentavos = false) {
  const formato = comCentavos ? reaisComCentavos : reais
  // O Intl usa um espaço especial (não quebrável) depois de "R$"; troca por um normal.
  return formato.format(centavos / 100).replace(/\s/, ' ')
}

// Variação percentual inteira entre dois valores (null se não dá para comparar).
export function variacaoPercentual(atual: number, anterior: number) {
  if (anterior === 0) return null
  return Math.round(((atual - anterior) / anterior) * 100)
}

// Parte de um total em % (0 a 100), para a largura das barras.
export function porcentagemDe(valor: number, total: number) {
  return total > 0 ? Math.min(100, (valor / total) * 100) : 0
}

// '2026-10-17' -> '17/10' (cortando a string para não sofrer com fuso horário)
export function formatarDiaMes(data: string) {
  const [, mes, dia] = data.split('-')
  return `${dia}/${mes}`
}

// Data de hoje no formato do <input type="date">: 'AAAA-MM-DD'.
export function hojeIso() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${hoje.getFullYear()}-${mes}-${dia}`
}
