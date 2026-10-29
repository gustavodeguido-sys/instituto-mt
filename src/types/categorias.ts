import type { LucideIcon } from 'lucide-react';

export interface CategoriaCardProps {
    categoria: CategoriaConfig;
    dados?: CategoriaRelatorio; // undefined enquanto a API não envia nada
    onOpen: (id: CategoriaId) => void;
}

export type TipoHospede = 'paciente' | 'acompanhante';
export interface Hospede {
id: number;
nome: string;
tipo: TipoHospede;
quarto: string;
cidadeOrigem: string;
telefone: string; // só dígitos: '11987654321'
dataEntrada: string; // 'AAAA-MM-DD'
dataSaida: string | null; // null = ainda está hospedado
pacienteId?: number; // existe só para acompanhantes
}
export type CategoriaId =
    | 'compras'
    | 'estoque-alimentos'
    | 'limpeza-higiene'
    | 'hospedagem'
    | 'captacao-empresas'
    | 'atividades';

// Parte fixa de cada categoria (texto e ícone), definida no front-end.
export interface CategoriaConfig {
    id: CategoriaId;
    titulo: string;
    descricao: string;
    icone: LucideIcon;
}

// Selo do canto do card (ex.: "R$ 8.940 no mês", "3 itens em falta").
export interface DestaqueCategoria {
    texto: string;
    tom: 'info' | 'alerta' | 'ok';
}

// Parte variável de cada categoria, que virá da API.
export interface CategoriaRelatorio {
    id: CategoriaId;
    totalRelatorios: number;
    atualizadoEm: string | null; // 'AAAA-MM-DD'
    destaque: DestaqueCategoria | null;
}

export type FormatoRelatorio = 'pdf' | 'xlsx';

// Um arquivo de relatório já gerado, disponível para download.
export interface ArquivoRelatorio {
    id: string;
    nome: string;
    categoria: CategoriaId;
    formato: FormatoRelatorio;
    tamanhoKb: number;
    periodoInicio: string; // 'AAAA-MM-DD'
    periodoFim: string; // 'AAAA-MM-DD'
    geradoPor: string;
    url: string;
}

// O que o modal "Novo relatório" envia para gerar um arquivo.
export interface NovoRelatorio {
    categoria: CategoriaId;
    periodoInicio: string; // 'AAAA-MM-DD'
    periodoFim: string; // 'AAAA-MM-DD'
    formato: FormatoRelatorio;
}

export interface LinhaRelatorio {
id: number;
data: string;
descricao: string;
quantidade: number;
valorCentavos: number | null; // estoque não tem valor; compras têm
}
// O que o formulário envia: tudo menos o que o banco gera ou o check-out define
export type NovoHospede = Omit<Hospede, 'id' | 'dataSaida'>
