import { useEffect, useState } from 'react'
import {
  PartyPopper,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { SeletorMes } from '@/components/SeletorMes'
import { useMesSelecionado } from '@/components/useMesSelecionado'
import { Button } from '@/components/ui/button'
import { mesAnterior, nomeDoMesSemAno } from '@/lib/mes'
import { buscarPainelFinanceiro, exportarFinanceiro } from '@/services/FinanceiroService'
import type { CategoriaDespesa, OrigemReceita, PainelFinanceiro } from '@/types/financeiro'
import NovoLancamentoBtn from './components/NovoLancamentoBtn'
import { DoacoesCard } from './components/DoacoesCard'
import { EventosCard } from './components/EventosCard'
import { GraficoArrecadacoes } from './components/GraficoArrecadacoes'
import { ListaComBarras } from './components/ListaComBarras'
import { CATEGORIAS_DESPESA, CLASSE_BARRA_DESPESA, ORIGENS_RECEITA } from './rotulos'
import { formatarReais, variacaoPercentual } from './utils'
import './FinanceiroPage.css'

// Junta nomes em uma frase: ['Bazar', 'Feijoada'] -> 'Bazar e Feijoada'.
const listaEmTexto = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' })

export default function FinanceiroPage() {
  // Hook próprio: mês selecionado, guardado na URL (?mes=AAAA-MM).
  const [mes, setMes] = useMesSelecionado()

  // useState: dados vindos do service (hoje null, depois da API).
  const [painel, setPainel] = useState<PainelFinanceiro | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [exportando, setExportando] = useState(false)

  // Contador que muda a cada novo lançamento salvo: como ele está nas
  // dependências do useEffect abaixo, mudar o valor faz os dados recarregarem.
  const [versao, setVersao] = useState(0)

  // useEffect com [mes, versao]: busca o painel de novo quando o mês muda
  // ou quando um lançamento é salvo. A flag `cancelado` descarta a resposta
  // de um mês antigo se o usuário trocar de mês antes de ela chegar.
  useEffect(() => {
    let cancelado = false

    async function carregarPainel() {
      setCarregando(true)
      setErro(null)
      try {
        const dados = await buscarPainelFinanceiro(mes)
        if (!cancelado) setPainel(dados)
      } catch {
        if (!cancelado) {
          setPainel(null)
          setErro('Não foi possível carregar os dados financeiros.')
        }
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }
    carregarPainel()

    return () => {
      cancelado = true
    }
  }, [mes, versao])

  async function handleExportar() {
    setExportando(true)
    try {
      await exportarFinanceiro(mes)
    } finally {
      setExportando(false)
    }
  }

  // ---- Números derivados (calculados a cada render, sem precisar de estado) ----
  const nomeMesAnterior = nomeDoMesSemAno(mesAnterior(mes))
  const eventos = painel?.eventos ?? []
  const lucroEventos = eventos.reduce((soma, e) => soma + (e.arrecadado - e.custos), 0)
  const saldo = painel ? painel.arrecadacao - painel.despesas : undefined

  const variacaoArrecadacao = painel
    ? variacaoPercentual(painel.arrecadacao, painel.arrecadacaoMesAnterior)
    : null
  const variacaoDespesas = painel
    ? variacaoPercentual(painel.despesas, painel.despesasMesAnterior)
    : null

  function textoArrecadacao() {
    if (!painel) return 'Sem lançamentos no mês'
    if (variacaoArrecadacao === null) return `Sem dados de ${nomeMesAnterior} para comparar`
    const sinal = variacaoArrecadacao > 0 ? '+' : ''
    return `${sinal}${variacaoArrecadacao}% em relação a ${nomeMesAnterior}`
  }

  function textoDespesas() {
    if (!painel) return 'Sem lançamentos no mês'
    if (variacaoDespesas === null) return `Sem dados de ${nomeMesAnterior} para comparar`
    if (variacaoDespesas === 0) return `Igual a ${nomeMesAnterior}`
    const direcao = variacaoDespesas < 0 ? 'menor' : 'maior'
    return `${Math.abs(variacaoDespesas)}% ${direcao} que ${nomeMesAnterior}`
  }

  const cards: {
    titulo: string
    valor: number | undefined
    descricao: string
    icone: LucideIcon
  }[] = [
    {
      titulo: 'Arrecadação no mês',
      valor: painel?.arrecadacao,
      descricao: textoArrecadacao(),
      icone: TrendingUp,
    },
    {
      titulo: 'Despesas no mês',
      valor: painel?.despesas,
      descricao: textoDespesas(),
      icone: TrendingDown,
    },
    {
      titulo: 'Saldo do mês',
      valor: saldo,
      descricao: 'Arrecadação menos despesas',
      icone: Wallet,
    },
    {
      titulo: 'Lucro com eventos',
      valor: painel ? lucroEventos : undefined,
      descricao:
        eventos.length > 0
          ? listaEmTexto.format(eventos.map((e) => e.nome))
          : 'Nenhum evento no mês',
      icone: PartyPopper,
    },
  ]

  // Itens das barras, na ordem definida em rotulos.ts.
  const itensOrigem = (Object.keys(ORIGENS_RECEITA) as OrigemReceita[]).map((id) => ({
    id,
    label: ORIGENS_RECEITA[id].label,
    valor: painel?.porOrigem[id] ?? 0,
    cor: ORIGENS_RECEITA[id].cor,
  }))

  const itensDespesa = (Object.keys(CATEGORIAS_DESPESA) as CategoriaDespesa[]).map((id) => ({
    id,
    label: CATEGORIAS_DESPESA[id],
    valor: painel?.porCategoria[id] ?? 0,
    cor: CLASSE_BARRA_DESPESA,
  }))

  return (
    <div className="financeiro-page flex min-h-0 flex-1 flex-col gap-[1.6vh]">
      {/* Cabeçalho: título, mês, exportar e novo lançamento */}
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,2.2vw,2.5rem)] uppercase text-slate-900">Financeiro</h1>
          <p className="mt-1 text-[clamp(12px,0.95vw,15px)] text-gray-600">
            Resumo financeiro da casa
          </p>
        </div>

        <div className="flex items-center gap-[0.6vw]">
          <SeletorMes value={mes} onChange={setMes} rotulo="Mês do financeiro" />
          <Button
            type="button"
            variant="outline"
            onClick={handleExportar}
            disabled={exportando || !painel}
            className="h-[4vh] min-h-8 bg-white px-[1.6vw] text-[clamp(12px,0.95vw,15px)]"
          >
            {exportando ? 'Exportando...' : 'Exportar'}
          </Button>
          <NovoLancamentoBtn
            onLancar={() => setVersao((v) => v + 1)}
            className="h-[4vh] min-h-8 bg-blue-600 px-3 text-[clamp(12px,0.95vw,15px)]
              text-white hover:bg-blue-700"
          />
        </div>
      </header>

      {erro && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      {/* Conteúdo rolável. aria-busy avisa leitores de tela durante o carregamento. */}
      <div
        className={`flex min-h-0 flex-1 flex-col gap-[1.6vh] overflow-y-auto pr-1 transition-opacity ${
          carregando ? 'opacity-60' : ''
        }`}
        aria-busy={carregando}
      >
        {/* Cards de indicadores: mostram "—" até a API enviar os números */}
        <section className="grid grid-cols-4 gap-[1vw]" aria-label="Indicadores financeiros">
          {cards.map(({ titulo, valor, descricao, icone: Icone }) => (
            <article
              key={titulo}
              className="flex flex-col rounded-[1.2vw] bg-white p-[1.4vw] shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[clamp(12px,0.95vw,15px)] font-medium text-slate-600">
                  {titulo}
                </h3>
                <span
                  className="flex size-9 items-center justify-center rounded-lg
                    bg-emerald-50 text-emerald-600"
                >
                  <Icone className="size-[18px]" aria-hidden="true" />
                </span>
              </div>
              <strong
                className={`valor-destaque mt-[1vh] ${
                  valor !== undefined && valor < 0 ? 'text-red-600' : ''
                }`}
              >
                {valor === undefined ? '—' : formatarReais(valor)}
              </strong>
              <p className="mt-[0.6vh] text-[clamp(10px,0.82vw,13px)] text-slate-500">
                {descricao}
              </p>
            </article>
          ))}
        </section>

        {/* Grade de 3 colunas: gráfico ocupa 2, as demais seções 1 cada */}
        <div className="grid grid-cols-3 gap-[1vw]">
          <GraficoArrecadacoes
            className="col-span-2"
            historico={painel?.historico ?? []}
            mesSelecionado={mes}
          />
          <ListaComBarras
            id="titulo-origem"
            titulo="Arrecadação por origem"
            total={painel?.arrecadacao}
            itens={itensOrigem}
          />
          <ListaComBarras
            id="titulo-categorias-despesa"
            titulo="Despesas por categoria"
            total={painel?.despesas}
            itens={itensDespesa}
          />
          <DoacoesCard painel={painel} />
          <EventosCard eventos={eventos} lucroTotal={painel ? lucroEventos : undefined} />
        </div>
      </div>
    </div>
  )
}
