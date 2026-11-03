import type { Reuniao, NovaReuniao, ReunioesPassadas } from "@/types/reunioes";



export async function buscarReunioes(): Promise<Reuniao[]>  {
    return []  
}
export async function buscarReunioesPassadas(limite = 5): Promise<ReunioesPassadas[]> {
    return []
}

export async function agendarReuniao(dados: NovaReuniao): Promise<void> {
    void dados
}