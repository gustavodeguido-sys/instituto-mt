import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const asset = (name: string) => `/assets/${name}.svg`

// Itens do menu lateral: cada botão leva à rota indicada em `path`.
const menuItems = [
   { label: 'Resumo', path: '/resumo', icon: 'resumo.svg' },
    { label: 'Hóspedes', path: '/hospedes', icon: 'pacientes.svg' },
    { label: 'Financeiro', path: '/financeiro', icon: 'financeiro.svg' },
    { label: 'Reuniões', path: '/reunioes', icon: 'reunioes.svg' },
    { label: 'Relatórios', path: '/relatorios', icon: 'relatorios.svg' },
]

// Descobre qual item do menu corresponde à URL atual
// (ex.: "/financeiro/123" ativa o item "Financeiro").
function itemFromPath(pathname: string) {
  return menuItems.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
  )
}

function DesignIcon({ file, size = 20 }: { file: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img src={asset(file)} alt="" />
    </span>
  )
}

/**
 * Menu lateral de navegação.
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
    <aside className="h-[76vh] w-[14vw] shrink-0 rounded-[2vw] border border-[#17c4eb] bg-[#d8dee7] p-[1vw]">
      <p className="mb-[0.8vh] font-['Inter:Semi_Bold'] text-[clamp(6px,0.55vw,9px)] font-semibold tracking-[0.44px] text-[#596575]">
        MENU
      </p>
      <Separator className="mb-[1.2vh] bg-[#17c4eb]/40" />
      <nav
        className="flex flex-col gap-[0.7vh] overflow-x-auto pb-1"
        aria-label="Menu principal"
      >
        {menuItems.map((item) => {
          const selected = activeLabel === item.label
          return (
            <Button
              key={item.label}
              type="button"
              variant="ghost"
              onClick={() => handleSelect(item)}
              className={`flex h-[4.2vh] w-full min-w-0 justify-start gap-[0.6vw] rounded-[0.8vw] border px-[0.8vw]
                text-left text-[clamp(8px,0.7vw,11px)] transition duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3569d4] ${
                selected
                  ? "border-[1.5px] border-[#10b981] bg-white font-['Inter:Semi_Bold'] font-semibold text-[#065f46] shadow-sm hover:bg-white hover:text-[#065f46]"
                  : "border-[rgba(16,185,129,0.55)] bg-white/45 font-['Inter:Medium'] font-medium text-[#202631] hover:bg-white/75 hover:text-[#202631]"
              }`}
              aria-current={selected ? "page" : undefined}
            >
              <DesignIcon file={item.icon} size={12} />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
