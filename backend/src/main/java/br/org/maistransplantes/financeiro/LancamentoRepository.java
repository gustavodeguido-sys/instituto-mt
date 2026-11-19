package br.org.maistransplantes.financeiro;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.org.maistransplantes.financeiro.enums.TipoLancamento;

public interface LancamentoRepository extends JpaRepository<Lancamento, UUID> {
    // Todos os lançamentos de um período (ex.: o mês, ou os últimos 6 meses do histórico).
    // Sem @EntityGraph: ele serve para trazer RELACIONAMENTOS junto (ex.: "evento"),
    // e os campos simples (tipo, descricao, valor, data) já vêm sempre na consulta.
    List<Lancamento> findByDataBetweenOrderByDataAsc(LocalDate inicio, LocalDate fim);

    // "Últimas doações": as 5 receitas mais recentes do período.
    // Cada parte do nome vira um parâmetro, na ordem: Tipo -> tipo, DataBetween -> inicio e fim.
    List<Lancamento> findTop5ByTipoAndDataBetweenOrderByDataDesc(
        TipoLancamento tipo, LocalDate inicio, LocalDate fim);

    long countByTipoAndDataBetween(TipoLancamento tipo, LocalDate inicio, LocalDate fim);

    // Soma (em centavos) dos lançamentos de um evento, de um tipo:
    // RECEITA = arrecadado, DESPESA = custos. COALESCE devolve 0 quando
    // o evento não tem lançamentos (SUM de nada é NULL, e NULL não cabe em long).
    @Query("""
            SELECT COALESCE(SUM(l.valorCentavos), 0)
            FROM Lancamento l
            WHERE l.evento.id = :eventoId AND l.tipo = :tipo
            """)
    long somarPorEventoETipo(@Param("eventoId") UUID eventoId, @Param("tipo") TipoLancamento tipo);

}
