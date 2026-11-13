export type SituacaoHospede =
  | 'pre-transplante'
  | 'pos-transplante'
  | 'internado-hc'
  | 'chegou-hoje'
  | 'saida-prevista'

export type FiltroHospedes =
  | 'todos'
  | 'pre-transplante'
  | 'pos-transplante'
  | 'internado-hc'

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
