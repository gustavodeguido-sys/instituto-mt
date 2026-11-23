// Wrapper de fetch usado por todos os services: prefixa /api (o proxy do Vite manda
// para o backend em dev), envia/recebe JSON e transforma resposta de erro em exceção.
export async function api<T>(caminho: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`/api${caminho}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
    })

    if (!res.ok) {
        // O backend responde erros como ProblemDetail (RFC 7807): o motivo legível vem em
        // "detail" (ex.: "O quarto 04 não tem vagas livres."). O .catch cobre respostas sem
        // corpo JSON (ex.: backend fora do ar), caindo na mensagem genérica.
        const problema = await res.json().catch(() => null)
        throw new Error(problema?.detail ?? `Erro ${res.status} em ${caminho}`)
    }

    // Algumas respostas não têm corpo (204 No Content, ou 201 Created de um POST
    // void, como o de lançamentos): res.json() nelas lançaria erro. Por isso lemos
    // como texto e só convertemos para JSON se veio alguma coisa.
    const texto = await res.text()
    return (texto ? JSON.parse(texto) : undefined) as T
}
