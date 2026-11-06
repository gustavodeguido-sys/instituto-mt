import type { CategoriaDespesa, OrigemReceita, TipoLancamento } from '@/types/financeiro'

// Textos e cores fixos do financeiro, definidos no front-end.
// A API manda só os ids ('empresas', 'alimentacao'...); aqui viram rótulos.
// A ordem dos objetos é a ordem em que aparecem na tela e nos selects.

export const TIPOS_LANCAMENTO: Record<TipoLancamento, string> = {
  receita: 'Arrecadação',
  despesa: 'Despesa',
}

export const ORIGENS_RECEITA: Record<OrigemReceita, { label: string; cor: string }> = {
  empresas: { label: 'Empresas parceiras', cor: 'bg-teal-900' },
  'pessoas-fisicas': { label: 'Doações de pessoas físicas', cor: 'bg-teal-500' },
  eventos: { label: 'Eventos beneficentes', cor: 'bg-blue-600' },
  outras: { label: 'Outras receitas', cor: 'bg-slate-600' },
}

export const CATEGORIAS_DESPESA: Record<CategoriaDespesa, string> = {
  alimentacao: 'Alimentação',
  contas: 'Contas (água, luz, gás e internet)',
  transporte: 'Transporte até o HC',
  limpeza: 'Limpeza e higiene',
  manutencao: 'Manutenção',
}

// Cores das séries do gráfico (hex, porque o Recharts pinta via SVG).
export const COR_ARRECADACAO = '#14b8a6' // teal-500
export const COR_DESPESA = '#f08a7b' // salmão do layout

// Mesma cor salmão como classe Tailwind, para as barras de despesa.
// (o Tailwind só gera classes escritas por extenso no código)
export const CLASSE_BARRA_DESPESA = 'bg-[#f08a7b]'
