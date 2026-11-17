package br.org.maistransplantes.resumo;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.org.maistransplantes.hospedes.HospedagemRepository;
import br.org.maistransplantes.hospedes.HospedeService;
import br.org.maistransplantes.resumo.dto.HospedagemAtualDto;
import br.org.maistransplantes.resumo.dto.ResumoDashboardDto;

@Service 
public class ResumoService {
    private final HospedeService hospedes;
    private final HospedagemRepository hospedagem; 

    public ResumoService(HospedeService hospedes, HospedagemRepository hospedagem) {
        this.hospedes = hospedes;
        this.hospedagem = hospedagem;
    }


    @Transactional (readOnly = true)
    public ResumoDashboardDto resumir(LocalDate hoje) {
        var r = hospedes.resumir(hoje); 
        
        var ativas = hospedagem.findByDataSaidaIsNullAndDataEntradaLessThanEqualOrderByDataEntradaAsc(hoje);
        var hospedagens = ativas.stream().map(HospedagemAtualDto::de).toList();
        long checkinsHoje = ativas.stream()
                            .filter(h -> h.getDataEntrada().equals(hoje))
                            .count();

        var proximas = hospedagem.findByDataSaidaIsNullAndDataEntradaAfterOrderByDataEntradaAsc(hoje);
        
        // Os números vêm do resumo de hóspedes (r). 100.0 força a conta em double, para
        // não truncar (ex.: 7 * 100 / 12 = 58 em long, mas 58,3 -> arredonda para 58).
        // Math.round devolve long, por isso o cast para int. Sem quartos cadastrados
        // (capacidade 0), a divisão daria erro/infinito: nesse caso a ocupação é 0.
        int ocupacaoPercentual = r.capacidadeTotal() == 0
            ? 0
            : (int) Math.round(r.hospedadosAgora() * 100.0 / r.capacidadeTotal());

        return new ResumoDashboardDto(
            r.hospedadosAgora(),
            r.acompanhantes(),
            r.capacidadeTotal(),
            r.vagasLivres()

        )
    }
}
