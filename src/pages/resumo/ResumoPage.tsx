import { Sidebar } from '../../components/Sidebar'
import { useState } from 'react'
import AddCheckIn from '../../components/AddCheckIn'

export default function ResumoPage() {
  const [active, setActive] = useState('Resumo')

  return (
    <main className="flex min-h-screen">
      <Sidebar active={active} onSelect={setActive} />
      <div className="flex flex-1 flex-col gap-4rounded-[30px] bg-[#D8DEE7] p-4 shadow-md
       w-[1096px] h-[884px] border-solid border-[1px] border-[#17C4EB] ml-4">
        <div className="flex items-start justify-between">
        <div>
        <h1 className="text-2xl font-semibold">Resumo</h1>
        <p className="mt-2 text-gray-600">Visão geral do sistema</p>
        </div>
        <div className="flex gap-3">
            <AddCheckIn />
            
        </div>
        </div>
      </div>
    </main>
  )
}