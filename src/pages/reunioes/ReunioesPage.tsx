import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { ReunioesPassadas, Reuniao } from "@/types/reunioes";
import  NovaReuniaoBtn  from './components/NovaReuniaoBtn'
import { Sidebar } from "@/components/Sidebar";
import { buscarReunioes, buscarReunioesPassadas } from "@/services/ReuniaoService";



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
}