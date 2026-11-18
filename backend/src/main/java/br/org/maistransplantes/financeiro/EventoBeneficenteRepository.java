package br.org.maistransplantes.financeiro;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EventoBeneficenteRepository extends JpaRepository<EventoBeneficente, UUID> {
    List<EventoBeneficente> findByDataBetweenOrderByDataAsc(LocalDate inicio, LocalDate fim);

    @Query("""
            SELECT COALESCE(SUM(l.valorCentavos), 0)
            FROM Lancamento l
            WHERE l.tipo = br.org.maistransplantes.financeiro.enums.TipoLancamento.RECEITA
            """)
    long somaReceitas();
}
