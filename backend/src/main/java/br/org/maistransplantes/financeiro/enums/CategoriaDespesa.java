package br.org.maistransplantes.financeiro.enums;

public enum CategoriaDespesa {
    ALIMENTACAO,
    CONTAS,
    TRANSPORTE,
    LIMPEZA,
    MANUTENCAO;

    public String toKebabCase() {
        return name().toLowerCase();
    }
}

