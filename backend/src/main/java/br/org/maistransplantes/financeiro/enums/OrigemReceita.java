package br.org.maistransplantes.financeiro.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonKey;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrigemReceita {
    EMPRESAS,
    PESSOAS_FISICAS,
    EVENTOS,
    OUTRAS;

    // @JsonKey: usa o kebab-case também quando o enum é chave de Map (porOrigem no painel).
    @JsonValue
    @JsonKey
    public String toKebabCase() {
        return name().toLowerCase().replace("_", "-");
    }

    @JsonCreator 
    public static OrigemReceita de(String valor) {
        return valueOf(valor.toUpperCase().replace('-', '_'));
    }
}
