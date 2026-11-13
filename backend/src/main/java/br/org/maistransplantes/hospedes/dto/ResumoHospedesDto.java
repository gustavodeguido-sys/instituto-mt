package br.org.maistransplantes.hospedes.dto;


public record ResumoHospedesDto( 
    long hospedadosAgora,
    long capacidadeTotal,
    long pacientes,
    long preTransplante,
    long posTransplante,
    long internadosHc,
    long acompanhantes,
    long vagasLivres,
    long saidasPrevistasSemana
) {}
