import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import ResumoPage from './pages/resumo/ResumoPage'
import HospedesPage from './pages/hospedes/HospedesPage'
import RelatoriosPage from './pages/relatorios/RelatoriosPage'
import RelatorioCategoriaPage from './pages/relatorios/RelatorioCategoriaPage'
import AppLayout from './layouts/AppLayout'
import ReunioesPage from './pages/reunioes/ReunioesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<AppLayout />}>
      <Route path="/resumo" element={<ResumoPage />} />
      <Route path="/hospedes" element={<HospedesPage />} />
      <Route path="/relatorios" element={<RelatoriosPage />} />
      <Route path="/relatorios/:categoria" element={<RelatorioCategoriaPage />} />
      <Route path="/reunioes" element={<ReunioesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
  )
}