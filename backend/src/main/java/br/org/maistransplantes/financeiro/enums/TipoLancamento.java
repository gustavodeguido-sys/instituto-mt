package br.org.maistransplantes.financeiro.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoLancamento {
    RECEITA,
    DESPESA;

    @JsonValue
    public String toKebabCase() {
        return name().toLowerCase();
    } 
}
