-- Quartos: de onde sai a capacidade total e as vagas livres.
CREATE TABLE quarto (
    id          BIGSERIAL PRIMARY KEY,
    numero      VARCHAR(10) NOT NULL UNIQUE,
    capacidade  INT NOT NULL CHECK (capacidade > 0)
);

CREATE TABLE paciente (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome              VARCHAR(150) NOT NULL,
    tipo_transplante  VARCHAR(60)  NOT NULL,
    telefone          VARCHAR(11),
    cidade_origem     VARCHAR(100)
);

CREATE TABLE acompanhante (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome         VARCHAR(150) NOT NULL,
    parentesco   VARCHAR(40),
    paciente_id  UUID NOT NULL REFERENCES paciente(id)
);

-- Uma estadia na casa. data_saida NULL = ainda hospedado.
-- data_entrada no futuro = "próxima hospedagem".
CREATE TABLE hospedagem (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id          UUID   NOT NULL REFERENCES paciente(id),
    acompanhante_id      UUID   REFERENCES acompanhante(id),
    quarto_id            BIGINT NOT NULL REFERENCES quarto(id),
    data_entrada         DATE   NOT NULL,
    data_saida_prevista  DATE,
    data_saida           DATE,
    situacao_clinica     VARCHAR(20) NOT NULL
        CHECK (situacao_clinica IN ('PRE_TRANSPLANTE','POS_TRANSPLANTE','INTERNADO_HC'))
);
CREATE INDEX idx_hospedagem_ativa ON hospedagem (data_saida);

CREATE TABLE evento_beneficente (
    id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome   VARCHAR(150) NOT NULL,
    data   DATE NOT NULL,
    local  VARCHAR(150) NOT NULL
);

-- Receita OU despesa. Dinheiro sempre em centavos (BIGINT).
CREATE TABLE lancamento (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo            VARCHAR(10)  NOT NULL CHECK (tipo IN ('RECEITA','DESPESA')),
    descricao       VARCHAR(200) NOT NULL,
    valor_centavos  BIGINT NOT NULL CHECK (valor_centavos > 0),
    data            DATE NOT NULL,
    observacoes     TEXT,
    origem          VARCHAR(20),   -- só receita
    categoria       VARCHAR(20),   -- só despesa
    evento_id       UUID REFERENCES evento_beneficente(id),
    -- espelha a "união discriminada" do TypeScript
    CHECK ((tipo = 'RECEITA' AND origem IS NOT NULL AND categoria IS NULL)
        OR (tipo = 'DESPESA' AND categoria IS NOT NULL AND origem IS NULL))
);
CREATE INDEX idx_lancamento_data ON lancamento (data);

CREATE TABLE participante (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome  VARCHAR(150) NOT NULL
);

CREATE TABLE reuniao (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo       VARCHAR(150) NOT NULL,
    data         DATE NOT NULL,
    hora_inicio  TIME NOT NULL,
    hora_fim     TIME NOT NULL CHECK (hora_fim > hora_inicio),
    formato      VARCHAR(12) NOT NULL CHECK (formato IN ('ONLINE','PRESENCIAL')),
    local        VARCHAR(200) NOT NULL,
    ata          TEXT          -- NULL = ata pendente
);

CREATE TABLE reuniao_participante (
    reuniao_id      UUID REFERENCES reuniao(id) ON DELETE CASCADE,
    participante_id UUID REFERENCES participante(id),
    PRIMARY KEY (reuniao_id, participante_id)
);

CREATE TABLE reuniao_pauta (
    reuniao_id  UUID REFERENCES reuniao(id) ON DELETE CASCADE,
    ordem       INT  NOT NULL,
    item        TEXT NOT NULL,
    PRIMARY KEY (reuniao_id, ordem)
);

CREATE TABLE arquivo_relatorio (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome            VARCHAR(200) NOT NULL,
    categoria       VARCHAR(30)  NOT NULL,
    formato         VARCHAR(4)   NOT NULL CHECK (formato IN ('PDF','XLSX')),
    tamanho_kb      INT NOT NULL,
    periodo_inicio  DATE NOT NULL,
    periodo_fim     DATE NOT NULL,
    gerado_por      VARCHAR(150) NOT NULL,
    caminho         VARCHAR(500) NOT NULL,   -- onde o arquivo está no disco
    criado_em       TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE usuario (            -- para o login com JWT
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    senha_hash  VARCHAR(100) NOT NULL
);