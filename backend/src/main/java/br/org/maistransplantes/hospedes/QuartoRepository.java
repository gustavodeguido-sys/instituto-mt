package br.org.maistransplantes.hospedes;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuartoRepository extends JpaRepository<Quarto, Long> {
    @Query("select coalesce(sum(q.capacidade), 0) from Quarto q")
    long somarCapacidade();

    Optional<Quarto> findByNumero(String numero);
    
}
