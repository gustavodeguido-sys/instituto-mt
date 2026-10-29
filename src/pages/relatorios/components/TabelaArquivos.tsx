import { Download, FileText, FolderOpen } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ArquivoRelatorio } from '@/types/categorias'
import { encontrarCategoria } from '../categorias'
import { formatarPeriodo } from '../utils'

interface TabelaArquivosProps {
  arquivos: ArquivoRelatorio[]
  carregando: boolean
  erro: string | null
  mostrarCategoria?: boolean // na página de uma categoria a coluna é redundante
  mensagemVazia: string
}

const classeCabecalho = 'text-[0.9em] uppercase text-slate-500'

// Tabela de arquivos de relatório, usada no hub ("Relatórios recentes")
// e na página de cada categoria.
export function TabelaArquivos({
  arquivos,
  carregando,
  erro,
  mostrarCategoria = true,
  mensagemVazia,
}: TabelaArquivosProps) {
  const totalColunas = mostrarCategoria ? 5 : 4

  return (
    <Table className="text-[clamp(8px,0.65vw,11px)]">
      <TableHeader className="sticky top-0 z-10 bg-slate-50">
        <TableRow className="hover:bg-transparent">
          <TableHead className={`pl-[1vw] ${classeCabecalho}`}>Relatório</TableHead>
          {mostrarCategoria && <TableHead className={classeCabecalho}>Categoria</TableHead>}
          <TableHead className={classeCabecalho}>Período</TableHead>
          <TableHead className={classeCabecalho}>Gerado por</TableHead>
          <TableHead className="pr-[1vw]">
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {carregando || erro || arquivos.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={totalColunas} className="h-[18vh] whitespace-normal text-center">
              <EstadoTabela carregando={carregando} erro={erro} mensagemVazia={mensagemVazia} />
            </TableCell>
          </TableRow>
        ) : (
          arquivos.map((arquivo) => (
            <TableRow key={arquivo.id}>
              <TableCell className="pl-[1vw]">
                <div className="flex items-center gap-[0.6vw]">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg
                      bg-emerald-50 text-emerald-600"
                  >
                    <FileText className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{arquivo.nome}</p>
                    <p className="text-slate-500 uppercase">
                      {arquivo.formato} · {arquivo.tamanhoKb} KB
                    </p>
                  </div>
                </div>
              </TableCell>
              {mostrarCategoria && (
                <TableCell>
                  <span
                    className="rounded-md bg-blue-50 px-2 py-0.5 text-[0.9em] font-medium
                      text-blue-700"
                  >
                    {encontrarCategoria(arquivo.categoria)?.titulo ?? arquivo.categoria}
                  </span>
                </TableCell>
              )}
              <TableCell className="text-slate-700">
                {formatarPeriodo(arquivo.periodoInicio, arquivo.periodoFim)}
              </TableCell>
              <TableCell className="text-slate-700">{arquivo.geradoPor}</TableCell>
              <TableCell className="pr-[1vw] text-right">
                {/* Link com visual de botão: o atributo download baixa o arquivo */}
                <a
                  href={arquivo.url}
                  download
                  className={buttonVariants({
                    variant: 'link',
                    size: 'xs',
                    className: 'text-[1em] text-blue-600',
                  })}
                >
                  <Download />
                  Baixar
                </a>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function EstadoTabela({
  carregando,
  erro,
  mensagemVazia,
}: {
  carregando: boolean
  erro: string | null
  mensagemVazia: string
}) {
  if (carregando) return <p className="text-slate-500">Carregando relatórios...</p>
  if (erro) return <p role="alert" className="text-red-600">{erro}</p>

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="flex size-10 items-center justify-center rounded-full
          bg-emerald-50 text-emerald-600"
      >
        <FolderOpen className="size-5" aria-hidden="true" />
      </span>
      <p className="font-semibold text-slate-800">Nenhum relatório encontrado</p>
      <p className="text-slate-500">{mensagemVazia}</p>
    </div>
  )
}
