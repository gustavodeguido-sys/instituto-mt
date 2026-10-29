import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Reuniao } from "@/types/reunioes";




export default function ReunioesPage() {
    const navigate = useNavigate()

    const [reunioes, setReunioes] = useState<Reuniao[]>([])
}