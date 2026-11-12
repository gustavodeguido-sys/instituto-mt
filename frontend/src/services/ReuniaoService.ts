import { api } from "@/lib/api";
import type { Reuniao, NovaReuniao, ReuniaoPassada } from "@/types/reunioes";

export async function buscarReunioes(): Promise<Reuniao[]>  {
    return api<Reuniao[]>('/reunioes')  
}
export async function buscarReunioesPassadas(limite = 5): Promise<ReuniaoPassada[]> {
    return api<ReuniaoPassada[]>(`/reunioes/passadas?limite=${limite}`)
}

export async function agendarReuniao(dados: NovaReuniao): Promise<void> {
    await api('/reunioes', { method: 'POST', body: JSON.stringify(dados) })
}