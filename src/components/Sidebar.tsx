const asset = (name: string) => `/assets/${name}.svg`

const menuItems = [
   { label: 'Resumo', icon: 'resumo.svg' },
    { label: 'Pacientes', icon: 'pacientes.svg' },
    { label: 'Financeiro', icon: 'financeiro.svg' },
    { label: 'Reuniões', icon: 'reunioes.svg' },
    { label: 'Relatórios', icon: 'relatorios.svg' },
]
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

export function Sidebar({
  active,
  onSelect,
}: {
  active: string
  onSelect: (label: string) => void
}) {
  return (
    <aside className="h-[76vh] w-[14vw] shrink-0 rounded-[2vw] border border-[#17c4eb] bg-[#d8dee7] p-[1vw]">
      <p className="mb-[1.2vh] font-['Inter:Semi_Bold'] text-[clamp(6px,0.55vw,9px)] font-semibold tracking-[0.44px] text-[#596575]">
        MENU
      </p>
      <nav
        className="flex flex-col gap-[0.7vh] overflow-x-auto pb-1"
        aria-label="Menu principal"
      >
        {menuItems.map((item) => {
          const selected = active === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={`flex h-[4.2vh] w-full min-w-0 items-center gap-[0.6vw] rounded-[0.8vw] border px-[0.8vw] text-left text-[clamp(8px,0.7vw,11px)] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3569d4] ${
                selected
                  ? "border-[1.5px] border-[#10b981] bg-white font-['Inter:Semi_Bold'] font-semibold text-[#065f46] shadow-sm"
                  : "border-[rgba(16,185,129,0.55)] bg-white/45 font-['Inter:Medium'] font-medium text-[#202631] hover:bg-white/75"
              }`}
              aria-current={selected ? "page" : undefined}
            >
              <DesignIcon file={item.icon} size={12} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
