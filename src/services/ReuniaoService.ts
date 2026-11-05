import type { Reuniao, NovaReuniao, ReuniaoPassada } from "@/types/reunioes";

function isoDaquiA(dias: number) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function buscarReunioes(): Promise<Reuniao[]>  {
    return []  
}
export async function buscarReunioesPassadas(limite = 5): Promise<ReuniaoPassada[]> {
    return []
}

export async function agendarReuniao(dados: NovaReuniao): Promise<void> {
    void dados
}