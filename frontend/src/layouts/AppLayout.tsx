import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import './AppLayout.css'

/**
 * Moldura das telas internas, em tela cheia: sidebar à esquerda e o container
 * principal ocupando todo o resto da janela (o gradiente de fundo não aparece mais).
 *
 * h-screen + overflow-hidden: a moldura tem exatamente a altura da janela; quem
 * rola é o <main>, então a sidebar fica sempre visível.
 * O fundo cinza fica no wrapper (e não só no <main>) para aparecer atrás dos
 * cantos arredondados da sidebar.
 */
export default function AppLayout() {
  return (
    <div className="app-page flex h-screen overflow-hidden bg-[#D8DEE7]">
      <Sidebar />

      {/* min-w-0/min-h-0: deixam as páginas encolherem dentro do flex em vez de
          estourar a janela (tabelas e listas rolam por dentro). */}
      <main
        className="flex min-h-0 min-w-0 flex-1 flex-col gap-[1.6vh] overflow-y-auto
          px-[3.3vw] py-[3.9vh]"
      >
        {/* Aqui o React Router coloca a página da rota atual */}
        <Outlet />
      </main>
    </div>
  )
}
