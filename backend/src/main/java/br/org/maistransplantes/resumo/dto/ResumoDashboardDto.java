package br.org.maistransplantes.resumo.dto;

import java.util.List;

public record ResumoDashboardDto( 
    long hospedadosAgora,
    long pacientesHospedados,
    long acompanhantes,
    long capacidadeTotal,
    long vagasLivres,
    int ocupacaoPercentual,
    long checkinsHoje,
    List<HospedagemAtualDto> hospedagens,
    List<ProximaHospedagemDto> proximasHospedagens
) {}
