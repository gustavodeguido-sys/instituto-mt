export async function api<T>(caminho: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`/api${caminho}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
    if (!res.ok) throw new Error(`Erro ${res.status} em ${caminho}`)
        return (res.status === 204 ? undefined : await res.json()) as T
}