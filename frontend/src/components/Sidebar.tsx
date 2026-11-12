import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  FileChartColumn,
  LayoutGrid,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Itens do menu lateral: cada botão leva à rota indicada em `path`.
// Ícones do lucide (mesma família usada no Figma): escalam com o texto e herdam a
// cor via `currentColor`, sem depender de arquivos .svg em /public.
const menuItems: { label: string; path: string; icon: LucideIcon }[] = [
  { label: 'Resumo', path: '/resumo', icon: LayoutGrid },
  { label: 'Hóspedes', path: '/hospedes', icon: Users },
  { label: 'Financeiro', path: '/financeiro', icon: Wallet },
  { label: 'Reuniões', path: '/reunioes', icon: CalendarDays },
  { label: 'Relatórios', path: '/relatorios', icon: FileChartColumn },
]

// Descobre qual item do menu corresponde à URL atual
// (ex.: "/financeiro/123" ativa o item "Financeiro").
function itemFromPath(pathname: string) {
  return menuItems.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
  )
}

/**
 * Menu lateral de navegação, ocupando a altura toda da janela.
 *
 * O item ativo é derivado da URL atual, então o destaque acompanha a página
 * mesmo após recarregar ou usar o botão "voltar" do navegador.
 * As props são opcionais: `active` força um item destacado e `onSelect`
 * avisa a página pai sobre o clique (a navegação acontece de qualquer forma).
 */
export function Sidebar({
  active,
  onSelect,
}: {
  active?: string
  onSelect?: (label: string) => void
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeLabel = active ?? itemFromPath(pathname)?.label

  // Ao clicar: notifica a página pai (se houver) e troca de rota.
  // Clicar no item já ativo não empilha a mesma rota no histórico.
  function handleSelect(item: (typeof menuItems)[number]) {
    onSelect?.(item.label)
    if (pathname !== item.path) navigate(item.path)
  }

  return (
    // Cantos arredondados só do lado direito: é o único lado com espaço livre
    // (os outros encostam nas bordas da janela).
    <aside
      className="flex h-full w-[17.2vw] min-w-[180px] shrink-0 flex-col rounded-r-[2vw]
        border-r border-[#17c4eb] bg-white px-[1.7vw] py-[3.9vh]
        shadow-[2px_0_16px_rgba(5,82,75,0.08)]"
    >
      <p className="mb-[0.8vh] text-[clamp(9px,0.76vw,12px)] font-bold tracking-[0.44px] text-[#596575]">
        MENU
      </p>
      <Separator className="mb-[1.2vh] bg-[#17c4eb]/40" />
      <nav
        className="flex flex-col gap-[1vh] overflow-y-auto pb-1"
        aria-label="Menu principal"
      >
        {menuItems.map((item) => {
          const selected = activeLabel === item.label
          const Icone = item.icon
          return (
            <Button
              key={item.label}
              type="button"
              variant="ghost"
              onClick={() => handleSelect(item)}
              className={`flex h-[4.7vh] min-h-10 w-full min-w-0 justify-start gap-[1vw] rounded-[1.1vw] border px-[1.1vw]
                text-left text-[clamp(12px,1.05vw,16px)] transition duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3569d4] ${
                selected
                  ? "border-[1.5px] border-[#10b981] bg-white font-bold text-[#065f46] shadow-sm hover:bg-white hover:text-[#065f46]"
                  : "border-[rgba(16,185,129,0.55)] bg-white font-medium text-[#202631] hover:bg-emerald-50/60 hover:text-[#202631]"
              }`}
              aria-current={selected ? "page" : undefined}
            >
              {/* Ícone ~22px em 1440px de largura: proporcional ao rótulo de ~15px.
                  Ter uma classe size-* desliga o size-4 padrão que o Button dá aos svgs. */}
              <Icone
                className="size-[clamp(16px,1.53vw,24px)] shrink-0 text-teal-700"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
