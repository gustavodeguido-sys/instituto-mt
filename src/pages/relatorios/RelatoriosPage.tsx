import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { buscarRelatoriosRecentes, buscarResumoCategorias } from '@/services/RelatoriosService'
import type { ArquivoRelatorio, CategoriaId, CategoriaRelatorio } from '@/types/categorias'
import { CATEGORIAS } from './categorias'
import { CategoriaCard } from './components/CategoriaCard'
import NovoRelatorioBtn from './components/NovoRelatorioBtn'
import { SeletorMes } from './components/SeletorMes'
import { TabelaArquivos } from './components/TabelaArquivos'
import { useMesSelecionado } from './useMesSelecionado'
import './RelatoriosPage.css'

export default function RelatoriosPage() {
  const navigate = useNavigate()

  // Hook próprio: mês selecionado, guardado na URL (?mes=AAAA-MM).
  const [mes, setMes] = useMesSelecionado()

  // useState: dados vindos do service (hoje vazios, depois da API).
  const [resumoCategorias, setResumoCategorias] = useState<CategoriaRelatorio[]>([])
  const [recentes, setRecentes] = useState<ArquivoRelatorio[]>([])
  const [carregandoRecentes, setCarregandoRecentes] = useState(true)
  const [erroRecentes, setErroRecentes] = useState<string | null>(null)

  // useEffect com [mes]: busca os números dos cards de novo sempre que o mês muda.
  // A flag `cancelado` descarta a resposta de um mês antigo caso o usuário
  // troque de mês antes da requisição anterior terminar.
  useEffect(() => {
    let cancelado = false

    buscarResumoCategorias(mes)
      .then((dados) => {
        if (!cancelado) setResumoCategorias(dados)
      })
      .catch(() => {
        // Sem dados, os cards continuam aparecendo com "0 relatórios".
        if (!cancelado) setResumoCategorias([])
      })

    return () => {
      cancelado = true
    }
  }, [mes])

  // useEffect com []: os relatórios recentes não dependem do mês,
  // então são buscados uma única vez, quando a página aparece.
  useEffect(() => {
    async function carregarRecentes() {
      try {
        setRecentes(await buscarRelatoriosRecentes())
      } catch {
        setErroRecentes('Não foi possível carregar os relatórios recentes.')
      } finally {
        setCarregandoRecentes(false)
      }
    }
    carregarRecentes()
  }, [])

  // useMemo: transforma a lista da API em um objeto indexado pelo id,
  // para cada card achar seus dados direto (resumoPorId['compras']).
  const resumoPorId = useMemo(
    () =>
      Object.fromEntries(resumoCategorias.map((item) => [item.id, item])) as Partial<
        Record<CategoriaId, CategoriaRelatorio>
      >,
    [resumoCategorias],
  )

  // Abre a página da categoria levando junto o mês selecionado.
  function abrirCategoria(id: CategoriaId | 'todos') {
    navigate(`/relatorios/${id}?mes=${mes}`)
  }

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
        {/* Cabeçalho: título, seletor de mês e botão de novo relatório */}
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(1.25rem,2vw,2rem)] uppercase text-slate-900">
              Relatórios
            </h1>
            <p className="mt-1 text-[clamp(8px,0.7vw,11px)] text-gray-600">
              Relatórios da casa organizados por categoria
            </p>
          </div>

          <div className="flex items-center gap-[0.6vw]">
            <SeletorMes value={mes} onChange={setMes} />
            <NovoRelatorioBtn
              className="h-[4vh] min-h-8 bg-blue-600 px-3 text-[clamp(8px,0.7vw,11px)]
                text-white hover:bg-blue-700"
            />
          </div>
        </header>

        {/* Conteúdo rolável: categorias + relatórios recentes */}
        <div className="flex min-h-0 flex-1 flex-col gap-[1.6vh] overflow-y-auto pr-1">
          <section aria-labelledby="titulo-categorias">
            <h2
              id="titulo-categorias"
              className="mb-[1vh] text-[clamp(10px,0.85vw,14px)] text-slate-800"
            >
              Categorias
            </h2>
            <div className="grid grid-cols-3 gap-[1vw]">
              {CATEGORIAS.map((categoria) => (
                <CategoriaCard
                  key={categoria.id}
                  categoria={categoria}
                  dados={resumoPorId[categoria.id]}
                  onOpen={abrirCategoria}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="titulo-recentes">
            <div className="mb-[1vh] flex items-center justify-between">
              <h2 id="titulo-recentes" className="text-[clamp(10px,0.85vw,14px)] text-slate-800">
                Relatórios recentes
              </h2>
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={() => abrirCategoria('todos')}
                className="text-[clamp(7px,0.6vw,10px)] text-blue-600"
              >
                Ver todos os relatórios
                <ArrowRight />
              </Button>
            </div>

            <div className="overflow-hidden rounded-[1.2vw] bg-white shadow-sm">
              <TabelaArquivos
                arquivos={recentes}
                carregando={carregandoRecentes}
                erro={erroRecentes}
                mensagemVazia='Os relatórios gerados em "Novo relatório" aparecerão aqui.'
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
