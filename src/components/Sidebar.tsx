const menuItems = [
    'Resumo',
    'Pacientes',
    'Financeiro',
    'Relatórios',
]

export function Sidebar() {
    return (
        <aside className="sidebar">
         <div className="sidebar-brand">
         <span className="brand-icon"></span>
         <div>
            <strong>INSTITUTO MAIS TRANSPLANTES</strong>
            <small>Sistema de Gestão</small>
         </div>
         </div>


        <nav className="sidebar-nav" aria-label="Menu principal">
            {menuItems.map((item) => (
            <button
            key={item}
            type="button"
            className={`nav-item ${item === 'Resumo' ? 'active' : ''}`}
            disabled={item !== 'Resumo'}
            >
                {item}
            </button>
            ))}
        </nav>

    </aside>
    )
}