package br.org.maistransplantes.reunioes;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
// @Transactional do Spring (não o do jakarta): só ele tem o atributo readOnly
import org.springframework.transaction.annotation.Transactional;

import br.org.maistransplantes.common.RegraNegocioException;
import br.org.maistransplantes.reunioes.dto.NovaReuniaoDto;
import br.org.maistransplantes.reunioes.dto.ParticipanteDto;
import br.org.maistransplantes.reunioes.dto.ReuniaoDto;
import br.org.maistransplantes.reunioes.dto.ReuniaoPassadaDto;

@Service 
public class ReuniaoService {

    private final ReuniaoRepository reunioes;
    private final ParticipanteRepository participantes;

    public ReuniaoService(ReuniaoRepository r, ParticipanteRepository p) {
        this.reunioes = r; this.participantes = p;
    }
    
    @Transactional(readOnly = true)
    public List<ReuniaoDto> buscarProximas() {
        return reunioes.findByDataGreaterThanEqualOrderByDataAscHoraInicioAsc(LocalDate.now())
            .stream().map(this::paraDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ReuniaoPassadaDto> buscarPassadas(int limite) {
        return reunioes.findByDataLessThanOrderByDataDesc(LocalDate.now(), PageRequest.of(0, limite))
            // a ordem dos argumentos segue a ordem dos campos do record ReuniaoPassadaDto
            .stream().map(r -> new ReuniaoPassadaDto(r.getId(), r.getTitulo(), r.getData(),
                r.getHoraInicio(), r.getHoraFim(), r.getFormato(), r.getLocal(),
                r.getParticipantes().size(),
                r.getAta() != null ? "disponivel" : "pendente"))
            .toList();
    }

    @Transactional 
    public ReuniaoDto agendar(NovaReuniaoDto dados) {
        if (!dados.horaFim().isAfter(dados.horaInicio()))
            throw new RegraNegocioException("O horário de término deve ser depois do início.");
        
         var reuniao = new Reuniao(dados.titulo(), dados.data(), dados.horaInicio(),
                                  dados.horaFim(), dados.formato(), dados.local());
        var ids = dados.participantes().stream().map(ParticipanteDto::id).toList();
        reuniao.getParticipantes().addAll(participantes.findAllById(ids));
        reuniao.getPauta().addAll(dados.pauta());
        return paraDto(reunioes.save(reuniao));
    }

    // Converte a entidade JPA no DTO devolvido pelo controller (nunca expor a entidade)
    private ReuniaoDto paraDto(Reuniao r) {
        return new ReuniaoDto(r.getId(), r.getTitulo(), r.getData(), r.getHoraInicio(),
            r.getHoraFim(), r.getFormato(), r.getLocal(),
            r.getParticipantes().stream().map(p -> new ParticipanteDto(p.getId(), p.getNome())).toList(),
            List.copyOf(r.getPauta()));
    }
}
