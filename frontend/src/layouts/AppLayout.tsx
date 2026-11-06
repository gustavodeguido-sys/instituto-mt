import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import './AppLayout.css'

export default function AppLayout() {
  return (
    <main
      className="app-page flex min-h-screen items-center justify-start gap-[1.5vw]
        overflow-hidden pl-[9.3vw] pr-[5.2vw]"
    >
      <Sidebar />

      <div
        className="flex h-[76vh] w-[70vw] flex-none flex-col gap-[1.6vh] rounded-[2vw]
          bg-[#D8DEE7] p-[1.5vw] shadow-md"
      >
        {/* Aqui o React Router coloca a página da rota atual */}
        <Outlet />
      </div>
    </main>
  )
}
