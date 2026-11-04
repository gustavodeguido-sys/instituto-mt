import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { ReunioesPassadas, Reuniao } from "@/types/reunioes";
import  NovaReuniaoBtn  from './components/NovaReuniaoBtn'
import { buscarReunioes, buscarReunioesPassadas } from "@/services/ReuniaoService";
import './ReunioesPage.css'
import AppLayout from "@/layouts/AppLayout";


export default function ReunioesPage() {
    const navigate = useNavigate()

    const [recentes, setRecentes] = useState<ReunioesPassadas[]>([])
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
        className="h-[4vh] min-h-8 bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)]
          text-white hover:bg-blue-700"
      />
    </div> 
    </div>
     
       
    )
}