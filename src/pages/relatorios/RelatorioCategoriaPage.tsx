import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { buttonVariants } from '@/components/ui/button'
import { buscarRelatorios } from '@/services/RelatoriosService'
import type { ArquivoRelatorio } from '@/types/categorias'
import { encontrarCategoria } from './categorias'
import NovoRelatorioBtn from './components/NovoRelatorioBtn'
import { SeletorMes } from './components/SeletorMes'
import { TabelaArquivos } from './components/TabelaArquivos'
import { useMesSelecionado } from './useMesSelecionado'
import { nomeDoMes } from './utils'
import './RelatoriosPage.css'

/**
 * Lista de arquivos de uma categoria (/relatorios/compras, /relatorios/hospedagem...).
 * A rota especial /relatorios/todos mostra os arquivos de todas as categorias.
 */
export default function RelatorioCategoriaPage() {
  // useParams: lê o pedaço dinâmico da URL definido na rota (/relatorios/:categoria).
  const { categoria: slug } = useParams()
  const todas = slug === 'todos'
  const categoria = encontrarCategoria(slug)

  // Hook próprio: mês selecionado, guardado na URL (?mes=AAAA-MM).
  const [mes, setMes] = useMesSelecionado()

  // useState: arquivos vindos do service (hoje vazios, depois da API).
  const [arquivos, setArquivos] = useState<ArquivoRelatorio[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // useEffect com [mes, categoria]: busca os arquivos de novo sempre que o mês
  // ou a categoria mudam. A flag `cancelado` descarta respostas antigas caso
  // o usuário troque de mês antes da requisição anterior terminar.
  useEffect(() => {
    let cancelado = false

    async function carregarArquivos() {
      setCarregando(true)
      setErro(null)
      try {
        const dados = await buscarRelatorios(mes, categoria?.id)
        if (!cancelado) setArquivos(dados)
      } catch {
        if (!cancelado) setErro('Não foi possível carregar os relatórios.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }
    carregarArquivos()

    return () => {
      cancelado = true
    }
  }, [mes, categoria?.id])

  // Categoria inexistente na URL: volta para o hub.
  // (Fica depois dos hooks porque o React exige que eles rodem sempre na mesma ordem.)
  if (!todas && !categoria) return <Navigate to="/relatorios" replace />

  const titulo = categoria?.titulo ?? 'Todos os relatórios'
  const descricao = categoria?.descricao ?? 'Arquivos de todas as categorias.'
  const totalArquivos = arquivos.length

  return (
    <main
      className="relatorios-page flex min-h-screen items-center justify-start gap-[1.5vw]
        overflow-hidden pl-[9.3vw] pr-[5.2vw]"
    >
      <Sidebar />

      <div
        className="flex h-[76vh] w-[70vw] flex-none flex-col gap-[1.6vh] rounded-[2vw]
          bg-[#D8DEE7] p-[1.5vw] shadow-md"
      >
        {/* Cabeçalho: voltar, título da categoria, seletor de mês e novo relatório */}
        <header className="flex items-end justify-between gap-4">
          <div>
            <Link
              to={`/relatorios?mes=${mes}`}
              className={buttonVariants({
                variant: 'link',
                size: 'xs',
                className: '-ml-2 text-[clamp(7px,0.6vw,10px)] text-blue-600',
              })}
            >
              <ArrowLeft />
              Relatórios
            </Link>
            <h1 className="text-[clamp(1.25rem,2vw,2rem)] uppercase text-slate-900">{titulo}</h1>
            <p className="mt-1 text-[clamp(8px,0.7vw,11px)] text-gray-600">{descricao}</p>
          </div>

          <div className="flex items-center gap-[0.6vw]">
            <SeletorMes value={mes} onChange={setMes} />
            <NovoRelatorioBtn
              categoriaInicial={categoria?.id}
              className="h-[4vh] min-h-8 bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)]
                text-white hover:bg-blue-700"
            />
          </div>
        </header>

        {/* Lista de arquivos do mês */}
        <section
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.2vw]
            bg-white shadow-sm"
          aria-labelledby="titulo-arquivos"
        >
          <div className="px-[1vw] pt-[1.4vh] pb-[1vh]">
            <h2 id="titulo-arquivos" className="text-[clamp(10px,0.85vw,14px)] text-slate-900">
              Arquivos de {nomeDoMes(mes).toLowerCase()}
            </h2>
            <p className="text-[clamp(7px,0.6vw,10px)] text-slate-500">
              {totalArquivos} {totalArquivos === 1 ? 'relatório' : 'relatórios'} no período
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <TabelaArquivos
              arquivos={arquivos}
              carregando={carregando}
              erro={erro}
              mostrarCategoria={todas}
              mensagemVazia="Não há relatórios neste mês. Gere um em “Novo relatório”."
            />
          </div>
        </section>
      </div>
    </main>
  )
}
