import { ArrowRight } from "lucide-react";
import type { CategoriaCardProps, DestaqueCategoria } from "@/types/categorias";
import { formatarAtualizacao } from "../utils";

// Cores do selo do canto conforme o tipo de destaque.
const coresDestaque: Record<DestaqueCategoria['tom'], string> = {
    info: 'bg-blue-50 text-blue-700',
    alerta: 'bg-amber-50 text-amber-700',
    ok: 'bg-emerald-50 text-emerald-700',
};

export function CategoriaCard ({
    categoria,
    dados,
    onOpen,
}: CategoriaCardProps) {
    const {id, titulo, descricao, icone: Icone} = categoria;
    const totalRelatorios = dados?.totalRelatorios ?? 0;
    const rotuloRelatorios = totalRelatorios === 1 ? 'relatório' : 'relatórios';

    // O card inteiro é um botão: clicar em qualquer parte abre a categoria.
    return (
        <button
            type="button"
            onClick={() => onOpen(id)}
            className="group flex flex-col rounded-[1.2vw] border border-transparent bg-white
                p-[1vw] text-left shadow-sm transition hover:border-emerald-300
                focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-[#3569d4]"
        >
            <div className="flex items-start justify-between">
                <span
                    className="flex size-7 items-center justify-center rounded-lg
                        bg-emerald-50 text-emerald-600"
                >
                    <Icone className="size-3.5" aria-hidden="true" />
                </span>
                {dados?.destaque && (
                    <span
                        className={`rounded-md px-2 py-0.5 text-[clamp(7px,0.55vw,9px)]
                            font-medium ${coresDestaque[dados.destaque.tom]}`}
                    >
                        {dados.destaque.texto}
                    </span>
                )}
            </div>

            <h3 className="mt-[1vh] text-[clamp(9px,0.8vw,13px)] text-slate-900">{titulo}</h3>
            <p className="mt-[0.5vh] text-[clamp(7px,0.62vw,10px)] text-slate-500">{descricao}</p>

            <footer
                className="mt-auto flex items-center justify-between border-t pt-[0.8vh]
                    text-[clamp(7px,0.58vw,9px)] text-slate-500"
            >
                <span>
                    {totalRelatorios} {rotuloRelatorios} ·{' '}
                    {formatarAtualizacao(dados?.atualizadoEm ?? null)}
                </span>
                <span className="flex items-center gap-0.5 font-medium text-blue-600">
                    Abrir
                    <ArrowRight
                        className="size-3 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                    />
                </span>
            </footer>
        </button>
    )
}
