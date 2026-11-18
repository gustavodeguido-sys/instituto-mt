package br.org.maistransplantes.financeiro;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LancamentoRepository extends JpaRepository<Lancamento, UUID> {
    @EntityGraph(attributePaths = {"TipoLancamento", "descricao", "valorCentavos", "data"})
    List<Lancamento> findByDataBetweenOrderByDataAsc(LocalDate inicio, LocalDate fim); 

    List<Lancamento> findTop5ByTipoAndDateBetweenOrderByDataDesc(LocalDate data);

    List<Lancamento> countByTipoAndDataBetween(UUID id);
}
