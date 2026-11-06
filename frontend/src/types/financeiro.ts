// Tipos do módulo financeiro (contrato com a futura API).
// IMPORTANTE: todo valor em dinheiro é em CENTAVOS (número inteiro),
// para não haver erro de arredondamento: R$ 42.350,00 -> 4235000.
// Datas: 'AAAA-MM-DD'. Meses: 'AAAA-MM'.

export type OrigemReceita = 'empresas' | 'pessoas-fisicas' | 'eventos' | 'outras'
export type CategoriaDespesa = 'alimentacao' | 'contas' | 'transporte' | 'limpeza' | 'manutencao'
export type TipoLancamento = 'receita' | 'despesa'

// Uma barra do gráfico "Arrecadações x despesas".
export interface TotalMensal {
    mes: string // 'AAAA-MM'
    arrecadacao: number
    despesas: number
}

export interface Doacao {
    id: string
    descricao: string // ex.: 'Mercado São Jorge', 'Doações via Pix (38)'
    data: string // 'AAAA-MM-DD'
    valor: number
}

export interface EventoBeneficente {
    id: string
    nome: string
    data: string // 'AAAA-MM-DD'
    local: string
    arrecadado: number
    custos: number
}

// Tudo o que a tela Financeiro mostra para um mês.
export interface PainelFinanceiro {
    mes: string // 'AAAA-MM'
    arrecadacao: number
    despesas: number
    arrecadacaoMesAnterior: number
    despesasMesAnterior: number
    historico: TotalMensal[] // últimos 6 meses, do mais antigo ao mais recente
    porOrigem: Record<OrigemReceita, number>
    porCategoria: Record<CategoriaDespesa, number>
    quantidadeDoacoes: number
    ultimasDoacoes: Doacao[]
    eventos: EventoBeneficente[]
}

// Campos comuns a qualquer lançamento.
interface LancamentoBase {
    descricao: string
    valor: number // centavos
    data: string // 'AAAA-MM-DD'
    observacoes: string | null
}

// O que o modal "Novo lançamento" envia. É uma "união discriminada":
// o campo `tipo` decide se o lançamento tem `origem` (receita) ou `categoria` (despesa),
// e o TypeScript não deixa misturar os dois.
export type NovoLancamento =
    | (LancamentoBase & { tipo: 'receita'; origem: OrigemReceita })
    | (LancamentoBase & { tipo: 'despesa'; categoria: CategoriaDespesa })
