import { useEffect, useState } from 'react'
import AddCheckIn from '../../components/AddCheckIn'
import { Sidebar } from '../../components/Sidebar'
import { buscarResumo } from '../../services/DashboardService'
import type { ResumoDashboard } from '../../types/dashboard'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../components/ui/table'
import './ResumoPage.css'


export default function ResumoPage() {
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null)
  const [paginaAtiva, setPaginaAtiva] = useState('Resumo')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect (() => {
    async function carregarDados() {
      try {
      const dados = await buscarResumo()
      setResumo(dados)
    } catch {
      setErro("Não foi possivel carregar o resumo.")
    } finally {
      setCarregando(false)
    }
  }
    carregarDados()
  }, [])

  if(carregando) return <p> Carregando resumo...</p>
  if(erro) return <p role='alert'>{erro}</p>
  if(!resumo) return <p>Resumo indisponível</p> 

  return (
    <main className="resumo-page flex min-h-screen items-center justify-start gap-[1.5vw] overflow-hidden pl-[9.3vw] pr-[5.2vw]">
      <Sidebar active={paginaAtiva} onSelect ={setPaginaAtiva} />
      <div className="flex h-[73.5vh] w-[70vw] flex-none flex-col gap-4 rounded-[2vw] bg-[#D8DEE7] p-[1.5vw] shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Resumo</h1>
            <p className="mt-1 text-[clamp(8px,0.7vw,11px)] text-gray-600">Visão geral do sistema</p>
          </div>
          <div className="flex gap-3">
            <AddCheckIn className="inline-flex h-[4vh] w-[11vw] items-center justify-center gap-2
             rounded-md bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)] outline outline-1 outline-offset-[-1px] outline-white/0" />
          </div>
          </div>
          <div className='grid grid-cols-4 p-4 gap-6'>
            <div className='bg-white rounded-[2vw] h-[120px]'>
              <h3 className='justify-start'>Hospedados Agora</h3>
              <strong className="strong-text">{resumo.hospedadosAgora}</strong></div>
            <div className='bg-white rounded-[2vw] h-[120px]'>
              <h3 className='justify-start'>Capacidade Total</h3>
              <strong className="strong-text">{resumo.capacidadeTotal}</strong></div>
            <div className='bg-white rounded-[2vw] h-[120px]'>
              <h3 className='justify-start'>Check-ins Hoje</h3>
              <strong className="strong-text" >{resumo.checkinsHoje}</strong></div>
            <div className='bg-white rounded-[2vw] h-[120px]'>
              <h3 className='justify-start'>Vagas Livres</h3>
              <strong className="strong-text">{resumo.vagasLivres}</strong></div>
          </div>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 gap-4">
          //Tabela de pacientes hospedados
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
              <TableBody>
                {resumo.hospedagens.map((hospedagem) => (
                  <TableRow key={hospedagem.paciente}>
                    <TableCell>{hospedagem.paciente}</TableCell>
                    <TableCell>{hospedagem.acompanhante}</TableCell>
                    <TableCell>{hospedagem.quarto}</TableCell>
                    <TableCell>{hospedagem.dataEntrada}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          //Check-in mais recente
          <div className="min-h-0 rounded-[1.2vw] bg-white p-4">02</div>
          //Gráfico de ocupação
          <div className="min-h-0 rounded-[1.2vw] bg-white p-4">03</div>
        </div>
      </div>
    </main>
  )
}
