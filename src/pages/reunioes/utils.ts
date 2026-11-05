function paraData(iso: string) {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

// '2026-10-23' -> { dia: '23', semana: 'qui', mes: 'outubro', mesCurto: 'out' }
export function partesDaData(iso: string) {
  const data = paraData(iso)
  const mes = data.toLocaleDateString('pt-BR', { month: 'long' })
  return {
    dia: String(data.getDate()).padStart(2, '0'),
    semana: data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
    mes,
    mesCurto: mes.slice(0, 3),
  }
}

// 'hoje', 'amanhã', 'em 4 dias'
export function contagemRegressiva(iso: string) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const dias = Math.round((paraData(iso).getTime() - hoje.getTime()) / 86_400_000)
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'amanhã'
  return `em ${dias} dias`
}

// 'Carla Ramos' -> 'CR'
export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}
