package br.org.maistransplantes.reunioes;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FormatoReuniao {
    ONLINE("online"), PRESENCIAL("presencial");

    private final String valor;
    FormatoReuniao(String valor) {
        this.valor = valor;
    } 

    @JsonValue public String valor() {
        return valor;
    }

    @JsonCreator public static FormatoReuniao de(String v) {
        for (var f : values()) if (f.valor.equals(v)) return f;
        throw new IllegalArgumentException("Formato inválido: " +  v);
    }
}
