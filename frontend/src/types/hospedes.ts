export type SituacaoClinica = 
  | 'pre-transplante' 
  | 'pos-transplante'
  | 'internado-hc'


export type SituacaoHospede =
     SituacaoClinica
  | 'chegou-hoje'
  | 'saida-prevista'

export type FiltroHospedes =
  | 'todos'
  | SituacaoClinica

export interface Hospede {
  id: string
  paciente: string
  tipoTransplante: string
  // Obrigatório: nenhum paciente se hospeda sozinho (NOT NULL no banco).
  acompanhante: string
  parentesco: string | null
  quarto: string
  dataEntrada: string
  situacao: SituacaoHospede
}

export interface ResumoHospedes {
  hospedadosAgora: number
  capacidadeTotal: number
  pacientes: number
  preTransplante: number
  posTransplante: number
  internadosHc: number
  acompanhantes: number
  vagasLivres: number
  saidasPrevistasSemana: number
}

// Quartos da casa (tabela quarto, migrations V2/V3). O formulário oferece só estes
// números em uma lista, evitando erro de digitação ("1" x "01").
// `as const` congela os valores: o TypeScript passa a conhecer cada texto exato, e
// NumeroQuarto vira a união '01' | '02' | '03' | '04' derivada da própria lista
// (assim os dois nunca ficam fora de sincronia).
export const NUMEROS_QUARTO = ['01', '02', '03', '04'] as const
export type NumeroQuarto = (typeof NUMEROS_QUARTO)[number]

// Dados do formulário de cadastro: sem id (gerado pelo banco), com a situação restrita
// aos 3 valores clínicos e o quarto restrito à lista acima. Espelha o NovoHospedeDto.
// Hospede.quarto continua string: é o que a API devolve, sem depender desta lista.
export type NovoHospede = Omit<Hospede, 'id' | 'situacao' | 'quarto'> & {
  situacao: SituacaoClinica
  quarto: NumeroQuarto
}
