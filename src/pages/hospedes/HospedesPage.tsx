import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
  BedDouble,
  Heart,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import NovoHospedeBtn from '@/components/NovoHospedeBtn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { buscarHospedes, buscarResumoHospedes } from '@/services/HospedesService'
import type {
  FiltroHospedes,
  Hospede,
  ResumoHospedes,
  SituacaoHospede,
} from '@/types/hospedes'
import './HospedesPage.css'

const ITENS_POR_PAGINA = 8

const filtros: { valor: FiltroHospedes; label: string }[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'pre-transplante', label: 'Pré-transplante' },
  { valor: 'pos-transplante', label: 'Pós-transplante' },
  { valor: 'internado-hc', label: 'Internados no HC' },
]

// Texto e cores do selo de cada situação na coluna "Situação".
const situacoes: Record<SituacaoHospede, { label: string; className: string }> = {
  'pre-transplante': { label: 'Pré-transplante', className: 'bg-blue-50 text-blue-700' },
  'pos-transplante': { label: 'Pós-transplante', className: 'bg-emerald-50 text-emerald-700' },
  'internado-hc': { label: 'Internado no HC', className: 'bg-amber-50 text-amber-700' },
  'chegou-hoje': { label: 'Chegou hoje', className: 'bg-slate-100 text-slate-600' },
  'saida-prevista': { label: 'Saída prevista', className: 'bg-slate-100 text-slate-600' },
}

// Remove acentos e caixa alta para a busca achar "joao" em "João".
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function formatarAtualizacao(data: Date) {
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `Atualizado em ${dia} às ${hora}`
}

export default function HospedesPage() {
  // useState: dados vindos do service (hoje vazios, depois da API).
  const [hospedes, setHospedes] = useState<Hospede[]>([])
  const [resumo, setResumo] = useState<ResumoHospedes | null>(null)
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // useState: estado da interface (texto da busca, filtro ativo e página da tabela).
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<FiltroHospedes>('todos')
  const [pagina, setPagina] = useState(1)

  // useEffect com [] roda uma única vez, quando a página aparece:
  // busca a lista e o resumo em paralelo e guarda o resultado no estado.
  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosHospedes, dadosResumo] = await Promise.all([
          buscarHospedes(),
          buscarResumoHospedes(),
        ])
        setHospedes(dadosHospedes)
        setResumo(dadosResumo)
        setAtualizadoEm(new Date())
      } catch {
        setErro('Não foi possível carregar os hóspedes.')
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
  }, [])

  // useMemo: conta quantos hóspedes existem em cada filtro (números dos botões).
  // Só recalcula quando a lista de hóspedes muda, não a cada tecla da busca.
  const contagemPorFiltro = useMemo<Record<FiltroHospedes, number>>(() => {
    const contar = (situacao: SituacaoHospede) =>
      hospedes.filter((hospede) => hospede.situacao === situacao).length

    return {
      todos: hospedes.length,
      'pre-transplante': contar('pre-transplante'),
      'pos-transplante': contar('pos-transplante'),
      'internado-hc': contar('internado-hc'),
    }
  }, [hospedes])

  // useMemo: aplica o filtro de situação e a busca por nome/quarto.
  // Recalcula apenas quando a lista, o filtro ou o texto da busca mudam.
  const hospedesFiltrados = useMemo(() => {
    const termo = normalizar(busca.trim())

    return hospedes.filter((hospede) => {
      const passaFiltro = filtro === 'todos' || hospede.situacao === filtro
      const passaBusca =
        termo === '' ||
        normalizar(hospede.paciente).includes(termo) ||
        normalizar(hospede.acompanhante ?? '').includes(termo) ||
        hospede.quarto.includes(termo)

      return passaFiltro && passaBusca
    })
  }, [hospedes, filtro, busca])

  const totalPaginas = Math.max(1, Math.ceil(hospedesFiltrados.length / ITENS_POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const hospedesDaPagina = hospedesFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  // Ao mudar busca ou filtro, volta para a primeira página.
  function handleBusca(event: ChangeEvent<HTMLInputElement>) {
    setBusca(event.target.value)
    setPagina(1)
  }

  function handleFiltro(valor: FiltroHospedes) {
    setFiltro(valor)
    setPagina(1)
  }

  const cards: {
    titulo: string
    valor: number | undefined
    descricao: string
    icone: LucideIcon
  }[] = [
    {
      titulo: 'Hospedados agora',
      valor: resumo?.hospedadosAgora,
      descricao: `Capacidade da casa: ${resumo?.capacidadeTotal ?? 0} vagas`,
      icone: Users,
    },
    {
      titulo: 'Pacientes',
      valor: resumo?.pacientes,
      descricao:
        `${resumo?.preTransplante ?? 0} pré · ${resumo?.posTransplante ?? 0} pós · ` +
        `${resumo?.internadosHc ?? 0} internados no HC`,
      icone: Heart,
    },
    {
      titulo: 'Acompanhantes',
      valor: resumo?.acompanhantes,
      descricao: `${resumo?.pacientesSemAcompanhante ?? 0} pacientes sem acompanhante`,
      icone: UserPlus,
    },
    {
      titulo: 'Vagas livres',
      valor: resumo?.vagasLivres,
      descricao: `${resumo?.saidasPrevistasSemana ?? 0} saídas previstas esta semana`,
      icone: BedDouble,
    },
  ]

  const temBuscaOuFiltro = busca.trim() !== '' || filtro !== 'todos'

  return (
    <main
      className="hospedes-page flex min-h-screen items-center justify-start gap-[1.5vw]
        overflow-hidden pl-[9.3vw] pr-[5.2vw]"
    >
      <Sidebar />

      <div
        className="flex h-[76vh] w-[70vw] flex-none flex-col gap-[1.6vh] rounded-[2vw]
          bg-[#D8DEE7] p-[1.5vw] shadow-md"
      >
        {/* Cabeçalho: título, busca e botão de cadastro */}
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(1.25rem,2vw,2rem)] uppercase text-slate-900">Hóspedes</h1>
            <p className="mt-1 text-[clamp(8px,0.7vw,11px)] text-gray-600">
              Pacientes e acompanhantes hospedados na casa
            </p>
          </div>

          <div className="flex items-center gap-[0.6vw]">
            <div className="relative w-[11vw] min-w-40">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5
                  -translate-y-1/2 text-slate-400"
              />
              <Input
                type="search"
                value={busca}
                onChange={handleBusca}
                placeholder="Buscar por nome ou quarto"
                aria-label="Buscar hóspede por nome ou quarto"
                className="h-[4vh] min-h-8 pl-8 text-[clamp(8px,0.7vw,11px)]"
              />
            </div>
            <NovoHospedeBtn
              className="h-[4vh] min-h-8 bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)]
                text-white hover:bg-blue-700"
            />
          </div>
        </header>

        {/* Cards de indicadores */}
        <section className="grid grid-cols-4 gap-[1vw]" aria-label="Indicadores de hospedagem">
          {cards.map(({ titulo, valor, descricao, icone: Icone }) => (
            <article
              key={titulo}
              className="flex flex-col rounded-[1.2vw] bg-white p-[1vw] shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[clamp(8px,0.7vw,11px)] font-medium text-slate-600">
                  {titulo}
                </h3>
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

        {/* Tabela de hóspedes */}
        <section
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.2vw]
            bg-white shadow-sm"
          aria-labelledby="titulo-lista-hospedes"
        >
          <div className="flex items-center justify-between gap-4 px-[1vw] pt-[1.4vh] pb-[1vh]">
            <div>
              <h2
                id="titulo-lista-hospedes"
                className="text-[clamp(10px,0.85vw,14px)] text-slate-900"
              >
                Lista de hóspedes
              </h2>
              <p className="text-[clamp(7px,0.6vw,10px)] text-slate-500">
                {atualizadoEm ? formatarAtualizacao(atualizadoEm) : 'Carregando...'}
              </p>
            </div>

            <div
              className="flex flex-wrap justify-end gap-[0.4vw]"
              role="group"
              aria-label="Filtrar por situação"
            >
              {filtros.map(({ valor, label }) => {
                const ativo = filtro === valor
                return (
                  <Button
                    key={valor}
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => handleFiltro(valor)}
                    aria-pressed={ativo}
                    className={`rounded-full px-3 text-[clamp(7px,0.6vw,10px)] ${
                      ativo
                        ? `border-emerald-500 bg-emerald-50 font-semibold
                          text-emerald-700 hover:bg-emerald-50`
                        : 'border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50/60'
                    }`}
                  >
                    {label} ({contagemPorFiltro[valor]})
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <Table className="text-[clamp(8px,0.65vw,11px)]">
              <TableHeader className="sticky top-0 z-10 bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-[1vw] text-[0.9em] uppercase text-slate-500">
                    Paciente
                  </TableHead>
                  <TableHead className="text-[0.9em] uppercase text-slate-500">Acompanhante</TableHead>
                  <TableHead className="text-[0.9em] uppercase text-slate-500">Quarto</TableHead>
                  <TableHead className="text-[0.9em] uppercase text-slate-500">Entrada</TableHead>
                  <TableHead className="text-[0.9em] uppercase text-slate-500">Situação</TableHead>
                  <TableHead className="pr-[1vw] text-right text-[0.9em] uppercase text-slate-500">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {carregando || erro || hospedesDaPagina.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="h-[26vh] whitespace-normal text-center">
                      <EstadoTabela
                        carregando={carregando}
                        erro={erro}
                        temBuscaOuFiltro={temBuscaOuFiltro}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  hospedesDaPagina.map((hospede) => (
                    <TableRow key={hospede.id}>
                      <TableCell className="pl-[1vw]">
                        <p className="font-semibold text-slate-800">{hospede.paciente}</p>
                        <p className="text-slate-500">{hospede.tipoTransplante}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-slate-800">{hospede.acompanhante ?? 'Sem acompanhante'}</p>
                        <p className="text-slate-500">{hospede.parentesco ?? '—'}</p>
                      </TableCell>
                      <TableCell className="text-slate-700">{hospede.quarto}</TableCell>
                      <TableCell className="text-slate-700">{hospede.dataEntrada}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[0.9em] font-medium
                            ${situacoes[hospede.situacao].className}`}
                        >
                          {situacoes[hospede.situacao].label}
                        </span>
                      </TableCell>
                      <TableCell className="pr-[1vw]">
                        {/* TODO: ligar editar/excluir quando houver backend */}
                        <div className="flex justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-xs"
                            aria-label={`Editar ${hospede.paciente}`}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-xs"
                            aria-label={`Excluir ${hospede.paciente}`}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Rodapé: contagem e paginação */}
          <footer
            className="flex items-center justify-between border-t px-[1vw] py-[0.8vh]
              text-[clamp(7px,0.6vw,10px)] text-slate-500"
          >
            <span>
              Mostrando {hospedesDaPagina.length} de {hospedesFiltrados.length} pacientes
            </span>

            <nav className="flex items-center gap-1" aria-label="Paginação">
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={() => setPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="text-[1em] text-blue-600"
              >
                ‹ Anterior
              </Button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                <Button
                  key={numero}
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setPagina(numero)}
                  aria-current={numero === paginaAtual ? 'page' : undefined}
                  className={`text-[1em] ${
                    numero === paginaAtual
                      ? 'border-emerald-500 font-semibold text-emerald-700'
                      : 'text-slate-600'
                  }`}
                >
                  {numero}
                </Button>
              ))}
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={() => setPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="text-[1em] text-blue-600"
              >
                Próxima ›
              </Button>
            </nav>
          </footer>
        </section>
      </div>
    </main>
  )
}

// Conteúdo mostrado no lugar das linhas: carregando, erro ou lista vazia.
function EstadoTabela({
  carregando,
  erro,
  temBuscaOuFiltro,
}: {
  carregando: boolean
  erro: string | null
  temBuscaOuFiltro: boolean
}) {
  if (carregando) return <p className="text-slate-500">Carregando hóspedes...</p>
  if (erro) return <p role="alert" className="text-red-600">{erro}</p>

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="flex size-10 items-center justify-center rounded-full
          bg-emerald-50 text-emerald-600"
      >
        <UsersRound className="size-5" aria-hidden="true" />
      </span>
      <p className="font-semibold text-slate-800">
        {temBuscaOuFiltro ? 'Nenhum hóspede encontrado' : 'Nenhum hóspede cadastrado'}
      </p>
      <p className="text-slate-500">
        {temBuscaOuFiltro
          ? 'Tente buscar por outro nome, quarto ou filtro.'
          : 'Clique em "Adicionar hóspede" para registrar o primeiro.'}
      </p>
    </div>
  )
}
