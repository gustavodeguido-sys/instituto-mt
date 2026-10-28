import { useEffect, useState } from 'react'
import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import {
  BedDouble,
  CalendarCheck,
  CalendarClock,
  House,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import AddCheckIn from '@/components/AddCheckIn'
import { Sidebar } from '@/components/Sidebar'
import { ProgressLabel, ProgressTrack, ProgressValue } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { buscarResumo } from '@/services/DashboardService'
import { buscarResumoOcupacao } from '@/services/OcupacaoService'
import type { ResumoDashboard } from '@/types/dashboard'
import type { OcupacaoResumo } from '@/types/ocupacao'
import './ResumoPage.css'

export default function ResumoPage() {
  // useState: dados vindos dos services. Ficam null enquanto não há API,
  // e a tela mostra cards, listas e barra de ocupação vazios.
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null)
  const [ocupacao, setOcupacao] = useState<OcupacaoResumo | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // useEffect com [] roda uma única vez, quando a página aparece:
  // busca o resumo e a ocupação em paralelo e guarda o resultado no estado.
  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosResumo, dadosOcupacao] = await Promise.all([
          buscarResumo(),
          buscarResumoOcupacao(),
        ])
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

  const hospedagens = resumo?.hospedagens ?? []
  const proximasHospedagens = resumo?.proximasHospedagens ?? []

  // Largura de cada cor na barra de ocupação, em % da capacidade.
  // Sem dados, a capacidade é 0 e a barra fica vazia.
  const pacientes = ocupacao?.pacientes ?? 0
  const acompanhantes = ocupacao?.acompanhantes ?? 0
  const vagasLivres = ocupacao?.vagasLivres ?? 0
  const capacidade = pacientes + acompanhantes + vagasLivres
  const porcentagem = (valor: number) => (capacidade > 0 ? (valor / capacidade) * 100 : 0)
  const ocupacaoPercentual = Math.round(porcentagem(pacientes + acompanhantes))

  const legendaOcupacao = [
    { label: 'Pacientes', valor: ocupacao?.pacientes, cor: 'bg-teal-500' },
    { label: 'Acompanhantes', valor: ocupacao?.acompanhantes, cor: 'bg-teal-900' },
    { label: 'Vagas livres', valor: ocupacao?.vagasLivres, cor: 'border border-slate-300 bg-white' },
  ]

  const cards: {
    titulo: string
    valor: number | undefined
    descricao: string
    icone: LucideIcon
  }[] = [
    {
      titulo: 'Hospedados agora',
      valor: resumo?.hospedadosAgora,
      descricao: 'Pacientes e acompanhantes na casa',
      icone: Users,
    },
    {
      titulo: 'Capacidade total',
      valor: resumo?.capacidadeTotal,
      descricao: 'Vagas disponíveis na casa',
      icone: House,
    },
    {
      titulo: 'Check-ins hoje',
      valor: resumo?.checkinsHoje,
      descricao: 'Entradas registradas hoje',
      icone: CalendarCheck,
    },
    {
      titulo: 'Vagas livres',
      valor: resumo?.vagasLivres,
      descricao: 'Disponíveis para novos hóspedes',
      icone: BedDouble,
    },
  ]

  return (
    <main
      className="resumo-page flex min-h-screen items-center justify-start gap-[1.5vw]
        overflow-hidden pl-[9.3vw] pr-[5.2vw]"
    >
      <Sidebar />

      <div
        className="flex h-[76vh] w-[70vw] flex-none flex-col gap-[1.6vh] rounded-[2vw]
          bg-[#D8DEE7] p-[1.5vw] shadow-md"
      >
        {/* Cabeçalho: título e botão de check-in */}
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(1.25rem,2vw,2rem)] uppercase text-slate-900">Resumo</h1>
            <p className="mt-1 text-[clamp(8px,0.7vw,11px)] text-gray-600">
              Visão geral do sistema
            </p>
          </div>
          <AddCheckIn
            className="h-[4vh] min-h-8 bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)]
              text-white hover:bg-blue-700"
          />
        </header>

        {/* Cards de indicadores: mostram "—" até a API enviar os números */}
        <section className="grid grid-cols-4 gap-[1vw]" aria-label="Indicadores da casa">
          {cards.map(({ titulo, valor, descricao, icone: Icone }) => (
            <article
              key={titulo}
              className="flex flex-col rounded-[1.2vw] bg-white p-[1vw] shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[clamp(8px,0.7vw,11px)] text-slate-700">{titulo}</h3>
                <span
                  className="flex size-7 items-center justify-center rounded-lg
                    bg-emerald-50 text-emerald-600"
                >
                  <Icone className="size-3.5" aria-hidden="true" />
                </span>
              </div>
              <strong className="strong-text">{valor ?? '—'}</strong>
              <p className="mt-[0.8vh] text-[clamp(7px,0.6vw,10px)] text-slate-500">
                {descricao}
              </p>
            </article>
          ))}
        </section>

        <div
          className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)]
            grid-rows-2 gap-[1vw]"
        >
          {/* Hospedagens atuais */}
          <section
            className="row-span-2 flex min-h-0 flex-col overflow-hidden rounded-[1.2vw]
              bg-white shadow-sm"
            aria-labelledby="titulo-hospedagens"
          >
            <div className="px-[1vw] pt-[1.4vh] pb-[1vh]">
              <h2 id="titulo-hospedagens" className="text-[clamp(10px,0.85vw,14px)] text-slate-900">
                Hospedagens atuais
              </h2>
              <p className="text-[clamp(7px,0.6vw,10px)] text-slate-500">
                Quem está na casa neste momento
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <Table className="text-[clamp(8px,0.65vw,11px)]">
                <TableHeader className="sticky top-0 z-10 bg-slate-50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-[1vw] text-[0.9em] uppercase text-slate-500">
                      Paciente
                    </TableHead>
                    <TableHead className="text-[0.9em] uppercase text-slate-500">
                      Acompanhante
                    </TableHead>
                    <TableHead className="text-[0.9em] uppercase text-slate-500">Quarto</TableHead>
                    <TableHead className="pr-[1vw] text-[0.9em] uppercase text-slate-500">
                      Entrada
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {hospedagens.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="h-[22vh] whitespace-normal text-center">
                        <EstadoVazio
                          icone={UsersRound}
                          titulo="Nenhuma hospedagem ativa"
                          descricao="Os hóspedes aparecerão aqui após o check-in."
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    hospedagens.map((hospedagem) => (
                      <TableRow key={hospedagem.id}>
                        <TableCell className="pl-[1vw] font-semibold text-slate-800">
                          {hospedagem.paciente}
                        </TableCell>
                        <TableCell className="text-slate-700">{hospedagem.acompanhante}</TableCell>
                        <TableCell className="text-slate-700">{hospedagem.quarto}</TableCell>
                        <TableCell className="pr-[1vw] text-slate-700">
                          {hospedagem.dataEntrada}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Próximas hospedagens */}
          <section
            className="flex min-h-0 flex-col rounded-[1.2vw] bg-white p-[1vw] shadow-sm"
            aria-labelledby="titulo-proximas"
          >
            <h2 id="titulo-proximas" className="text-[clamp(10px,0.85vw,14px)] text-slate-900">
              Próximas hospedagens
            </h2>
            <p className="text-[clamp(7px,0.6vw,10px)] text-slate-500">Chegadas previstas</p>

            {proximasHospedagens.length === 0 ? (
              <div
                className="flex flex-1 items-center justify-center
                  text-[clamp(8px,0.65vw,11px)]"
              >
                <EstadoVazio
                  icone={CalendarClock}
                  titulo="Nenhuma hospedagem agendada"
                  descricao="As próximas chegadas aparecerão aqui."
                />
              </div>
            ) : (
              <ul className="mt-[1vh] flex min-h-0 flex-col gap-[0.6vh] overflow-y-auto">
                {proximasHospedagens.map((proxima) => (
                  <li
                    key={proxima.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50
                      px-[0.6vw] py-[0.6vh] text-[clamp(8px,0.65vw,11px)]"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{proxima.paciente}</p>
                      <p className="text-slate-500">Quarto {proxima.quarto}</p>
                    </div>
                    <span className="text-slate-600">{proxima.dataPrevista}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Ocupação da casa: barra dividida em pacientes, acompanhantes e vagas livres */}
          <section className="min-h-0 rounded-[1.2vw] bg-white p-[1vw] shadow-sm">
            <ProgressPrimitive.Root
              value={ocupacaoPercentual}
              className="flex flex-col gap-[1vh]"
              aria-label="Ocupação da casa"
            >
              <div className="flex w-full items-center justify-between">
                <ProgressLabel
                  className="text-[clamp(10px,0.85vw,14px)] font-bold text-slate-900"
                >
                  Ocupação da casa
                </ProgressLabel>
                <ProgressValue className="text-[clamp(8px,0.65vw,11px)] text-slate-500">
                  {() => (ocupacao ? `${pacientes + acompanhantes}/${capacidade}` : '—')}
                </ProgressValue>
              </div>

              <ProgressTrack className="h-2.5 bg-slate-100">
                <span
                  className="h-full bg-teal-500 transition-all"
                  style={{ width: `${porcentagem(pacientes)}%` }}
                />
                <span
                  className="h-full bg-teal-900 transition-all"
                  style={{ width: `${porcentagem(acompanhantes)}%` }}
                />
              </ProgressTrack>
            </ProgressPrimitive.Root>

            <ul
              className="mt-[1.2vh] grid gap-[0.6vh] text-[clamp(8px,0.65vw,11px)]
                text-slate-500"
            >
              {legendaOcupacao.map(({ label, valor, cor }) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className={`inline-block size-2 rounded-full ${cor}`} />
                    {label}
                  </span>
                  <span className="font-semibold text-slate-700">{valor ?? '—'}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

// Mensagem padrão para listas sem dados.
function EstadoVazio({
  icone: Icone,
  titulo,
  descricao,
}: {
  icone: LucideIcon
  titulo: string
  descricao: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span
        className="flex size-10 items-center justify-center rounded-full
          bg-emerald-50 text-emerald-600"
      >
        <Icone className="size-5" aria-hidden="true" />
      </span>
      <p className="font-semibold text-slate-800">{titulo}</p>
      <p className="text-slate-500">{descricao}</p>
    </div>
  )
}
