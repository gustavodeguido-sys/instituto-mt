package br.org.maistransplantes.reunioes;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReuniaoRepository extends JpaRepository<Reuniao, UUID> {
    List<Reuniao> findByDataGreaterThanEqualOrderByDataAscHoraInicioAsc(LocalDate hoje);
    List<Reuniao> findByDataLessThanOrderByDataDesc(LocalDate hoje, Pageable pageable);   
}


