import { Sidebar } from './components/Sidebar'
import { StatCard } from './components/StatCard'
import './App.css'

const stats = [
  {
    title: 'Pacientes cadastrados',
    value: '3',
    description: 'Total de pacientes',
  },
  {
    title: 'Acompanhantes',
    value: '3',
    description: 'Total de acompanhantes',
  },
  {
    title: 'Receitas',
    value: 'R$ 25.000',
    description: 'Valor demonstrativo',
  },
  {
    title: 'Despesas',
    value: 'R$ 9.000',
    description: 'Valor demonstrativo',
  },
]

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem vindo ao Sistema de Gestão do Instituto</p>
          </div>

          <span className="demo-badge">
            Ambiente de demonstração
          </span>
        </header>

        <section className="stats-grid" aria-label="Indicadores">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section className="content-card">
          <h2>Atendimentos recentes</h2>
          <p>Exemplos ficticios para desenvolvimento</p>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Tipo</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Paciente Exemplo 01</td>
                  <td>Acompanhamento</td>
                  <td><span className="status">Ativo</span></td>
                </tr>
                <tr>
                  <td>Paciente Exemplo 03</td>
                  <td>Acompanhamento</td>
                  <td><span className="status">Ativo</span></td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
