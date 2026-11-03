export interface Reuniao {
    titulo: string;
    formato: 'online' | 'presencial'
    inicio: string;
    horario: string;
    local: string;
    participantes: number;
}

export interface ReunioesPassadas {
    titulo: string;
    horario: string;
    local: string;
    participantes: number;
}

export type NovaReuniao = Omit<Reuniao, 'id'>