package br.org.maistransplantes.financeiro.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum OrigemReceita {
    EMPRESAS,
    PESSOAS_FISICAS,
    EVENTOS,
    OUTRAS;

    @JsonValue 
    public String toKebabCase() {
        return name().toLowerCase().replace("_", "-");
    }
}
