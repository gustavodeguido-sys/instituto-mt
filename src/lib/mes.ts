// Funções de mês compartilhadas entre telas (relatórios, financeiro...).
// Os meses circulam como string 'AAAA-MM'.

function doisDigitos(numero: number) {
  return String(numero).padStart(2, '0')
}

export function mesAtual() {
  const hoje = new Date()
  return `${hoje.getFullYear()}-${doisDigitos(hoje.getMonth() + 1)}`
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

// '2026-10' -> 'outubro'  |  com curto: 'out'
export function nomeDoMesSemAno(mes: string, curto = false) {
  const [ano, numero] = mes.split('-').map(Number)
  const nome = new Date(ano, numero - 1).toLocaleDateString('pt-BR', {
    month: curto ? 'short' : 'long',
  })
  return nome.replace('.', '')
}

// '2026-10' -> '2026-09' (funciona na virada do ano: '2026-01' -> '2025-12')
export function mesAnterior(mes: string) {
  const [ano, numero] = mes.split('-').map(Number)
  const data = new Date(ano, numero - 2)
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}`
}

// Os últimos `quantidade` meses, do mais recente para o mais antigo.
export function ultimosMeses(quantidade = 12) {
  const hoje = new Date()
  return Array.from({ length: quantidade }, (_, i) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i)
    return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}`
  })
}
