import { useCallback, useEffect, useState } from "react";
import type { ReuniaoPassada, Reuniao } from "@/types/reunioes";
import  NovaReuniaoBtn  from './components/NovaReuniaoBtn'
import { buscarReunioes, buscarReunioesPassadas } from "@/services/ReuniaoService";
import './ReunioesPage.css'
import { ProximaReuniaoCard } from "./components/ProximaReuniaoCard";
import { ReuniaoPassadaItem } from "./components/ReuniaoPassadaItem";

export default function ReunioesPage() {
  
    const [recentes, setRecentes] = useState<ReuniaoPassada[]>([])
    const [carregandoRecentes, setCarregandoRecentes] = useState(true)
    const [erroRecentes, setErroRecentes] = useState<string | null>(null)
    const [proximas, setProximas] = useState<Reuniao[]>([])
    const [carregandoProximas, setCarregandoProximas] = useState(true)
    const [erroProximas, setErroProximas] = useState<string | null>(null)
    // o mesmo para passadas (que você já tem como "recentes")


    const carregarRecentes = useCallback(async () => {
        try { setRecentes(await buscarReunioesPassadas()) }
        catch { setErroRecentes('Não foi possível carregar as reuniões recentes') }
        finally { setCarregandoRecentes(false) }
    }, [])

    const carregarProximas = useCallback(async () => {
        try { setProximas(await buscarReunioes()) }
        catch { setErroProximas('Não foi possível carregar as próximas reuniões') }
        finally { setCarregandoProximas(false) }
    }, [])

    useEffect(() => {
        carregarProximas()
        carregarRecentes()
    }, [carregarProximas, carregarRecentes])

    // O card mostra UMA reunião: a primeira da lista (o serviço deve devolvê-las ordenadas por data)
    const proximaReuniao: Reuniao | undefined = proximas[0]

    return (
      <div className="resumo-page flex min-h-0 flex-1 flex-col gap-[1.6vh]">
    <div className="flex items-start justify-between gap-[0.6vw]">
      <div className="flex flex-col gap-[0.6vw]">
        <header className="header-reunioes flex flex-col justify-between gap-4">
          REUNIÕES
        </header>
        <p className="mt-1 flex flex-col font-[11px] text-gray-600">
          Reunião entre os gestores da casa
        </p>
      </div>
      <NovaReuniaoBtn
      onAgendada={carregarProximas}
        className="h-[4vh] min-h-8 bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)]
          text-white hover:bg-blue-700"
      />
    </div> 
       <div className="flex min-h-0 flex-1 flex-col gap-[2vh] overflow-y-auto pr-1">
        <section aria-label="Próxima reunião">
  {carregandoProximas ? (
    <p className="text-sm text-slate-500">Carregando…</p>
  ) : erroProximas ? (
    <p className="text-sm text-red-600">{erroProximas}</p>
  ) : proximaReuniao ? (
    <ProximaReuniaoCard
      reuniao={proximaReuniao}
      onVerDetalhes={(id) => console.log('detalhes', id)} // depois: navigate(`/reunioes/${id}`)
      onEditar={(id) => console.log('editar', id)}
    />
  ) : (
    <p className="rounded-[1.2vw] bg-white p-[1.2vw] text-sm text-slate-500">
      Nenhuma reunião agendada. Use "Agendar reunião" para marcar a próxima.
    </p>
  )}
</section>

<section aria-labelledby="titulo-passadas">
  <div className="mb-[1vh] flex items-center justify-between">
    <h2 id="titulo-passadas" className="text-[clamp(10px,0.85vw,14px)] font-semibold text-slate-800">
      Reuniões passadas
    </h2>
    <span className="text-[clamp(7px,0.6vw,10px)] text-slate-600">Últimos 3 meses</span>
  </div>

  {carregandoRecentes ? (
    <p className="text-sm text-slate-500">Carregando…</p>
  ) : erroRecentes ? (
    <p className="text-sm text-red-600">{erroRecentes}</p>
  ) : recentes.length === 0 ? (
    <p className="text-sm text-slate-500">Nenhuma reunião nos últimos 3 meses.</p>
  ) : (
    <ul className="flex flex-col gap-[1vh]">
      {recentes.map((r) => (
        <ReuniaoPassadaItem key={r.id} reuniao={r} onAbrirAta={(x) => console.log('ata', x.id)} />
      ))}
    </ul>
  )}
</section>

      </div>

    </div>
     
       
    )
}