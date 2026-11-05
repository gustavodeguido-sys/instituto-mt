import type { LucideIcon } from 'lucide-react'

// Mensagem padrão para listas/seções sem dados: ícone, título e uma dica
// do próximo passo. Usada no Resumo e no Financeiro.
export function EstadoVazio({
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
