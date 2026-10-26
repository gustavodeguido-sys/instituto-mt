import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import ResumoPage from './pages/resumo/ResumoPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/resumo" element={<ResumoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}