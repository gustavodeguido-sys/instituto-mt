package br.org.maistransplantes.hospedes;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospedagemRepository extends JpaRepository<Hospedagem, UUID> {
    @EntityGraph(attributePaths = {"paciente", "acompanhante", "quarto"}) 
    List<Hospedagem> findByDataSaidaIsNullAndDataEntradaLessThanEqualOrderByDataEntradaAsc(LocalDate hoje);

    boolean existsByPacienteIdAndDataSaidaIsNull(UUID pacienteId);
    long countByQuartoIdAndDataSaidaIsNull(Long quartoId);
}
