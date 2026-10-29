import {
  Apple,
  BedDouble,
  Handshake,
  ShoppingCart,
  Sparkles,
  SprayCan,
} from 'lucide-react'
import type { CategoriaConfig } from '@/types/categorias'

// Lista única das categorias: alimenta os cards do hub, o modal de novo
// relatório e a página de cada categoria. Para criar uma categoria nova,
// basta adicionar um item aqui (e o id em CategoriaId).
export const CATEGORIAS: CategoriaConfig[] = [
  {
    id: 'compras',
    titulo: 'Compras da casa',
    descricao: 'Notas e listas de compras do mês, fornecedores e valores gastos.',
    icone: ShoppingCart,
  },
  {
    id: 'estoque-alimentos',
    titulo: 'Estoque de alimentos',
    descricao: 'Entradas e saídas da despensa, validade e itens perto de acabar.',
    icone: Apple,
  },
  {
    id: 'limpeza-higiene',
    titulo: 'Itens de limpeza e higiene',
    descricao: 'Produtos de limpeza, higiene pessoal e descartáveis da casa.',
    icone: SprayCan,
  },
  {
    id: 'hospedagem',
    titulo: 'Controle de hospedagem',
    descricao: 'Entradas, saídas, ocupação dos quartos e tempo médio de estadia.',
    icone: BedDouble,
  },
  {
    id: 'captacao-empresas',
    titulo: 'Captação de empresas',
    descricao: 'Empresas parceiras, contatos realizados e doações captadas.',
    icone: Handshake,
  },
  {
    id: 'atividades',
    titulo: 'Atividades da casa',
    descricao: 'Eventos, oficinas e atividades realizadas com os hóspedes.',
    icone: Sparkles,
  },
]

export function encontrarCategoria(id: string | undefined) {
  return CATEGORIAS.find((categoria) => categoria.id === id)
}
