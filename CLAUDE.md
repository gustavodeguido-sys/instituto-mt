# CLAUDE.md — Instituto Mais Transplantes

Dashboard administrativo da casa de apoio do Instituto Mais Transplantes, que hospeda
pacientes transplantados (pré e pós-transplante) e seus acompanhantes. Os gestores usam
o painel para acompanhar hospedagem, finanças, reuniões e relatórios.

Idioma do projeto: **português (pt-BR)** em código de domínio, comentários, textos de UI e
mensagens de commit.

## Estrutura do repositório

```
instituto-mais-transplantes/
├── frontend/   React + Vite + Tailwind v4 + shadcn (existe)
└── backend/    Spring Boot 4 + PostgreSQL (em construção)
```

**Git:** monorepo — o repositório de trabalho é a raiz **`instituto-mais-transplantes/`**
(branch `main`, remoto `origin` = `instituto-mt`), com `frontend/` e `backend/` dentro.
Existe também um repositório antigo em `C:/Users/cliente/Documents/projetos/` (branch
`master`) que engloba esta pasta: **não usar** — comandos git (stash, checkout) rodados
lá reescrevem os arquivos do projeto.

Ainda **não há API**. Todo dado vem de `frontend/src/services/*`, que hoje devolvem
listas vazias, `null` ou mocks. Ao criar o backend, só o corpo das funções de service muda.

## Comandos

Frontend (rodar dentro de `frontend/`):

```bash
npm run dev       # Vite em http://localhost:5173
npm run build     # tsc -b && vite build  (é o type-check do projeto)
npm run lint      # oxlint
npx shadcn@latest add <componente>   # instala componente em src/components/ui
```

Backend (rodar dentro de `backend/`, com o PostgreSQL ligado):

```bash
./mvnw spring-boot:run   # API em http://localhost:8080
./mvnw test              # sobe o contexto contra o banco local (confere conexão + Flyway)
```

Ambiente: Windows. No frontend não há testes automatizados configurados.

---

## Frontend

### Stack
- React 19, TypeScript ~6 (strict: `noUnusedLocals`, `noUnusedParameters`,
  `verbatimModuleSyntax` → use `import type` para tipos), Vite 8.
- Tailwind CSS v4 via `@tailwindcss/vite` (sem `tailwind.config`; tema em `src/index.css`).
- shadcn com estilo **`base-nova`**, construído sobre **`@base-ui/react`** (NÃO Radix).
- `react-router-dom` v7 (`BrowserRouter` em `main.tsx`, `<Routes>` em `App.tsx`).
- `lucide-react` para ícones, `recharts` para gráficos (via `components/ui/chart.tsx`).
- `cn` vem do pacote `cn` (`import { cn } from "@/lib/utils"`).
- Alias `@/` → `src/`.

### Organização de pastas
```
src/
├── App.tsx              rotas; "/" = login, demais rotas dentro de <AppLayout>
├── layouts/AppLayout    Sidebar + container cinza com <Outlet/>
├── components/          compartilhados: Sidebar, SeletorMes, EstadoVazio, useMesSelecionado…
│   └── ui/              componentes shadcn — gerados pelo CLI
├── pages/<modulo>/      uma pasta por tela
│   ├── <Modulo>Page.tsx
│   ├── <Modulo>Page.css estilos tipográficos da página (classe raiz .<modulo>-page)
│   ├── components/      componentes usados só por esse módulo
│   └── utils.ts         formatação/helpers do módulo
├── lib/                 utils (cn) e helpers globais — lib/mes.ts: funções de mês 'AAAA-MM'
├── services/<X>Service.ts   funções async de acesso a dados (futura API)
└── types/<dominio>.ts       interfaces/tipos do domínio (contrato com a API)
```

Módulos/rotas: `/resumo`, `/hospedes`, `/financeiro`, `/reunioes`, `/relatorios`,
`/relatorios/:categoria` (`todos` = todas as categorias). Novo módulo = pasta em `pages/`,
rota em `App.tsx` dentro de `<AppLayout>` e item em `menuItems` de `components/Sidebar.tsx`.

### Convenções de código
- **Nomes em português**: `buscarHospedes`, `agendarReuniao`, `gerarRelatorio`,
  `carregando`, `erro`, `NovoHospede`, `ResumoHospedes`.
- Botões que abrem modal de cadastro: `Novo<Coisa>Btn.tsx` — `Dialog` controlado por
  `useState(open)`, `<form onSubmit>` com `Field`/`Label`/`Input`, e callback opcional
  (`onAgendada`, `onLancar`…) para a página recarregar a lista.
- Páginas: `export default function XPage()`; componentes menores: export nomeado.
- Tipos de criação derivados do tipo principal: `type NovaReuniao = Omit<Reuniao, 'id'>`.
- Mapas de rótulo/cor tipados com `Record<UnionType, …>` (ex.: `situacoes` em HospedesPage).
- **Comentários didáticos em português** explicando o porquê de hooks e decisões
  (`// useMemo: só recalcula quando…`). Manter esse estilo ao escrever código novo.

### Padrão de carregamento de dados em página
```tsx
const [dados, setDados] = useState<T[]>([])
const [carregando, setCarregando] = useState(true)
const [erro, setErro] = useState<string | null>(null)

useEffect(() => {
  let cancelado = false            // descarta resposta antiga se a dependência mudar
  buscarAlgo(param)
    .then((r) => { if (!cancelado) setDados(r) })
    .catch(() => { if (!cancelado) setErro('Não foi possível carregar …') })
    .finally(() => { if (!cancelado) setCarregando(false) })
  return () => { cancelado = true }
}, [param])
```
Toda lista/tabela deve tratar os 3 estados: **carregando**, **erro** (`role="alert"`) e
**vazio** (mensagem orientando o próximo passo). Buscas independentes vão em `Promise.all`.
Estado que deve sobreviver a reload/navegação fica na URL (ver `useMesSelecionado`, `?mes=AAAA-MM`).

### Datas e valores
- Datas trafegam como string `'AAAA-MM-DD'`; meses como `'AAAA-MM'`.
- Para exibir, **quebrar a string** (`split('-')`) ou criar `new Date(ano, mes-1, dia)` —
  nunca `new Date('2026-10-19')`, que sofre com fuso horário.
- Formatação com `toLocaleDateString('pt-BR', …)`. Helpers em `pages/*/utils.ts`.
- Dinheiro: **centavos inteiros** no contrato com a API (documentar no topo do arquivo de
  tipos, como em `types/financeiro.ts`) e formatar só na exibição
  (`formatarReais` em `pages/financeiro/utils.ts`, via `Intl.NumberFormat` BRL).

### Visual / layout
- Layout em unidades de viewport: containers em `vw`/`vh`, fontes com `clamp()`
  (ex.: `text-[clamp(8px,0.7vw,11px)]`). Seguir esse padrão para manter proporção.
- Fundo do app: gradiente verde-água (`#0bb8a9 → #05524b`); container `bg-[#D8DEE7]`
  `rounded-[2vw]`; cards `bg-white rounded-[1.2vw] p-[1vw] shadow-sm`.
- Acentos: `emerald-*` (ícones, filtros ativos, selos ok), `blue-600` (botão primário e
  links), `amber-*` (alerta), `#17c4eb` (borda da sidebar).
- Selos/badges: `rounded-md px-2 py-0.5 font-medium bg-<cor>-50 text-<cor>-700`.
- Títulos de página: `h1` uppercase `text-[clamp(1.25rem,2vw,2rem)]` + subtítulo cinza.
- Foco acessível: `focus-visible:outline-2 focus-visible:outline-[#3569d4]`;
  usar `aria-label`, `aria-current`, `aria-pressed`, `aria-labelledby` como já feito.

### shadcn/ui (base-nova + Base UI)
Instalados: `button`, `card`, `chart`, `dialog`, `field`, `input`, `label`, `progress`,
`select`, `separator`, `table`, `textarea`.

**Diferenças em relação ao shadcn/Radix** (cuidado ao copiar exemplos da internet):
- Composição usa a prop **`render`**, não `asChild`:
  `<DialogTrigger render={<Button>…</Button>} />`,
  `<DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>`.
- Primitivos importados de `@base-ui/react/<componente>`.
- Variantes de `Button`: `default | outline | secondary | ghost | destructive | link`;
  tamanhos `xs | sm | default | lg | icon | icon-xs | icon-sm | icon-lg`.

Regras:
- Sempre preferir um componente shadcn a HTML cru estilizado. Se não estiver instalado,
  instalar com o CLI (`npx shadcn@latest add …`) em vez de escrever à mão.
- Não reescrever arquivos de `components/ui/`; customizar via `className` no uso.
- Componentes recomendados para o que falta:
  | Necessidade | Componente |
  |---|---|
  | `<select>` nativo dos formulários (ver `NovoLancamentoBtn`) | `select` (já instalado; usar prop `items` p/ o `SelectValue` mostrar o rótulo) |
  | selos de situação/destaque | `badge` |
  | confirmação de exclusão | `alert-dialog` |
  | feedback de salvar/erro | `sonner` (toast) |
  | estado carregando | `skeleton` |
  | escolher data | `popover` + `calendar` |
  | paginação de tabelas | `pagination` |
  | filtros em abas / segmentos | `tabs` ou `toggle-group` |
  | ações por linha | `dropdown-menu` |
  | campos longos (pauta, ata) | `textarea` (já instalado) |
  | participantes | `avatar` |
  | gráficos do financeiro | `chart` (Recharts) já instalado |

---

## Backend (em construção)

Projeto gerado (Spring Initializr), ainda sem módulos. Rodar com `./mvnw spring-boot:run`
dentro de `backend/`.

### Stack
- Java 21 + **Spring Boot 4.x**, Maven, pasta `backend/`. Atenção ao copiar exemplos
  da internet (escritos para 3.x): starters são modulares (`spring-boot-starter-webmvc`,
  `spring-boot-starter-flyway`) e o Jackson é o 3 (pacote `tools.jackson`).
- Configuração: `application.properties` (sem segredos) + perfil padrão `local`
  (`application-local.properties`, fora do git; modelo em `.example`).
  O PostgreSQL 18 local roda na porta **5433**.
- Spring Web, Spring Data JPA, Bean Validation, PostgreSQL driver, **Flyway** para
  migrations (`src/main/resources/db/migration/V1__*.sql`), springdoc-openapi (Swagger).
- Spring Security + JWT para a tela de login (`/` no front).
- Porta 8080; todas as rotas sob **`/api`**.

### Arquitetura (pacote por funcionalidade, espelhando os módulos do front)
```
br.org.maistransplantes/
├── hospedes/    HospedeController, HospedeService, HospedeRepository, Hospede (entity), dto/
├── financeiro/
├── reunioes/
├── relatorios/
├── dashboard/   (resumo + ocupação)
├── auth/
└── common/      config (CORS, Security), tratamento de erros, utilitários
```
- Controller → Service → Repository. Controllers só recebem/devolvem **DTOs** (`record`),
  nunca entidades JPA.
- Validação com `@Valid` + anotações (`@NotBlank`, `@NotNull`…); erros em formato
  `ProblemDetail` (RFC 7807) via `@RestControllerAdvice`.
- Nomes de tabela/coluna em `snake_case` no Postgres; JSON em `camelCase`.

### Contrato com o frontend
Os tipos em `frontend/src/types/*.ts` **são o contrato**: os DTOs Java devem gerar
exatamente esse JSON. Ao mudar um, atualizar o outro.
- `LocalDate` → `"AAAA-MM-DD"`, `YearMonth` → `"AAAA-MM"`, `LocalTime` → `"HH:mm"`.
- Enums do TS são kebab-case (`'pre-transplante'`, `'internado-hc'`, `'estoque-alimentos'`):
  no Java usar enum com `@JsonValue`/`@JsonCreator` (ou converter) para manter o formato.
- Campos opcionais do TS (`string | null`) → `null` no JSON, não omitidos.
- Endpoints já previstos nos comentários dos services:
  - `GET /api/dashboard/resumo`, `GET /api/ocupacao`
  - `GET /api/hospedes`, `GET /api/hospedes/resumo`, `POST /api/hospedes`
  - `GET /api/reunioes`, `GET /api/reunioes/passadas?limite=`, `POST /api/reunioes`
  - `GET /api/relatorios/categorias?mes=`, `GET /api/relatorios?mes=&categoria=&limite=`,
    `POST /api/relatorios`
  - `GET /api/financeiro?mes=`, `POST /api/financeiro/lancamentos`, `GET /api/financeiro/exportar?mes=`

### Integração front ↔ back (quando a API existir)
- Criar `frontend/src/lib/api.ts` com um wrapper de `fetch` (base `/api`, JSON, token,
  lança erro em `!res.ok`) e usá-lo nos services — **manter as assinaturas** das funções.
- Em dev, configurar `server.proxy` no `vite.config.ts` (`'/api' → http://localhost:8080`)
  em vez de liberar CORS geral.
- Credenciais do banco via variáveis de ambiente / `application-local.properties` fora do git.

---

## Como trabalhar neste projeto
- Antes de concluir mudanças no front, rodar `npm run build` e `npm run lint` em `frontend/`.
- Manter o padrão existente (nomes em PT, comentários explicativos, estados de
  carregando/erro/vazio, layout em vw/vh/clamp) em vez de introduzir novos estilos.
- Não fazer commit sem pedido explícito.
