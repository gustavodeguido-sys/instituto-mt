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
    <aside className="rounded-[30px] border border-[#17c4eb] bg-[#d8dee7] p-4 lg:min-h-[884px] lg:w-[219px] lg:shrink-0">
      <p className="mb-4 font-['Inter:Semi_Bold'] text-[11px] font-semibold tracking-[0.88px] text-[#596575]">
        MENU
      </p>
      <nav
        className="flex gap-2 overflow-x-auto pb-1 lg:flex-col"
        aria-label="Menu principal"
      >
        {menuItems.map((item) => {
          const selected = active === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={`flex h-11 min-w-[156px] items-center gap-3 rounded-2xl border px-4 text-left text-sm transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3569d4] lg:w-full ${
                selected
                  ? "border-[1.5px] border-[#10b981] bg-white font-['Inter:Semi_Bold'] font-semibold text-[#065f46] shadow-sm"
                  : "border-[rgba(16,185,129,0.55)] bg-white/45 font-['Inter:Medium'] font-medium text-[#202631] hover:bg-white/75"
              }`}
              aria-current={selected ? "page" : undefined}
            >
              <DesignIcon file={item.icon} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}