
export type FormatoReuniao = 'online' | 'presencial'
export type StatusAta = 'disponivel' | 'pendente'

export interface Participante {
    id: string;
    nome: string;
}

export interface Reuniao {
    id: string;
    titulo: string;
    data: string;
    horaInicio: string;
    horaFim: string;
    formato: FormatoReuniao;
    local: string;
    participantes: Participante[];
    pauta: string[];
}

export interface ReuniaoPassada 
   extends Omit<Reuniao, 'pauta' | 'participantes'> {
   totalParticipantes: number;
   ata: StatusAta 
}

export type NovaReuniao = Omit<Reuniao, 'id'>