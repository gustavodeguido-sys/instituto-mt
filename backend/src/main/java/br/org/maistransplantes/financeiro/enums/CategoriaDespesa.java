package br.org.maistransplantes.financeiro.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonKey;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoriaDespesa {
    ALIMENTACAO,
    CONTAS,
    TRANSPORTE,
    LIMPEZA,
    MANUTENCAO;

    // @JsonValue: como o valor é escrito no JSON ("alimentacao").
    // @JsonKey: o mesmo, mas quando o enum é CHAVE de um Map (porCategoria no painel).
    @JsonValue
    @JsonKey
    public String toKebabCase() {
        return name().toLowerCase();
    }

    // @JsonCreator: o caminho inverso, ao ler o JSON do front ("alimentacao" -> ALIMENTACAO).
    @JsonCreator
    public static CategoriaDespesa de(String valor) {
        return valueOf(valor.toUpperCase());
    }
}
