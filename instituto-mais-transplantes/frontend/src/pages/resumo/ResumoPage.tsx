import { useEffect, useState } from 'react'
import AddCheckIn from '../../components/AddCheckIn'
import { Sidebar } from '../../components/Sidebar'
import { buscarResumo } from '../../services/DashboardService'
import { buscarResumoOcupacao } from '../../services/OcupacaoService'
import type { ResumoDashboard } from '../../types/dashboard'
import type { OcupacaoResumo } from '../../types/ocupacao'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table'
import { Progress, ProgressLabel, ProgressValue } from '../../components/ui/progress'
import './ResumoPage.css'




export default function ResumoPage() {
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null)
  const [ocupacao, setOcupacao] = useState<OcupacaoResumo | null>(null)
  const [paginaAtiva, setPaginaAtiva] = useState('Resumo')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosResumo, dadosOcupacao] = await Promise.all([buscarResumo(), buscarResumoOcupacao()])
        setResumo(dadosResumo)
        setOcupacao(dadosOcupacao)
      } catch {
        setErro('Não foi possível carregar o resumo.')
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
  }, [])

  if (carregando) return <p>Carregando resumo...</p>
  if (erro) return <p role="alert">{erro}</p>
  if (!resumo || !ocupacao) return <p>Resumo indisponível</p>

  const ocupados = ocupacao.pacientes + ocupacao.acompanhantes
  const capacidade = ocupados + ocupacao.vagasLivres
  const percentual = capacidade > 0 ? Math.round((ocupados / capacidade) * 100) : 0

  return (
    <main className="resumo-page flex min-h-screen items-center justify-start gap-[1.5vw] overflow-hidden pl-[9.3vw] pr-[5.2vw]">
      <Sidebar active={paginaAtiva} onSelect={setPaginaAtiva} />
      <div className="flex h-[73.5vh] w-[70vw] flex-none flex-col gap-4 rounded-[2vw] bg-[#D8DEE7] p-[1.5vw] shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Resumo</h1>
            <p className="mt-1 text-[clamp(8px,0.7vw,11px)] text-gray-600">Visão geral do sistema</p>
            </div>
            <AddCheckIn className="inline-flex h-[4vh] w-[11vw] items-center justify-center 
            gap-2 rounded-md bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)]" />
            </div>
        <div className="grid grid-cols-4 gap-6 p-4">
          <div className="h-[120px] rounded-[2vw] bg-white">
            <h3>Hospedados Agora</h3>
            <strong className="strong-text">{resumo.hospedadosAgora}</strong>
            </div>
            <div className="h-[120px] rounded-[2vw] bg-white">
              <h3>Capacidade Total</h3>
              <strong className="strong-text">{resumo.capacidadeTotal}</strong>
              </div>
              <div className="h-[120px] rounded-[2vw] bg-white">
                <h3>Check-ins Hoje</h3>
                <strong className="strong-text">{resumo.checkinsHoje}</strong>
                </div>
                <div className="h-[120px] rounded-[2vw] bg-white">
                  <h3>Vagas Livres</h3>
                  <strong className="strong-text">{resumo.vagasLivres}</strong>
                  </div>
                  </div>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 gap-4">
          <div className="row-span-2 min-h-0 rounded-[1.2vw] bg-white p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Acompanhante</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead>Situação</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>{resumo.hospedagens.map((hospedagem) => 
                    <TableRow key={hospedagem.paciente}>
                      <TableCell>{hospedagem.paciente}</TableCell>
                      <TableCell>{hospedagem.acompanhante}</TableCell>
                      <TableCell>{hospedagem.quarto}</TableCell>
                      <TableCell>{hospedagem.dataEntrada}</TableCell>
                      </TableRow>)}
                      </TableBody>
                      </Table>
                      </div>
          <div className="min-h-0 rounded-[1.2vw] bg-white p-4">02

          </div>
          <div className="min-h-0 rounded-[1.2vw] bg-white p-4">
            <Progress value={percentual} className="flex-col
             gap-2" aria-label="Ocupação da casa">
              <div className="flex w-full items-center justify-between text-xs
               font-semibold text-slate-800">
                <ProgressLabel>Ocupação da casa</ProgressLabel>
                <ProgressValue>{() => `${ocupados}/${capacidade}`}</ProgressValue>
                </div>
            </Progress>
            <div className="mt-2 grid gap-1 text-[10px] text-slate-500">
              <div className="flex justify-between">
                <span>
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />Pacientes</span>
                  <span>{ocupacao.pacientes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-teal-900" />Acompanhantes</span>
                      <span>{ocupacao.acompanhantes}</span>
                      </div>
                      <div className="flex justify-between"><span>
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full border 
                        border-slate-300 bg-white" />Vagas livres</span>
                        <span>{ocupacao.vagasLivres}</span>
                        </div>
                        </div>
          </div>
        </div>
      </div>
    </main>
  )
}
