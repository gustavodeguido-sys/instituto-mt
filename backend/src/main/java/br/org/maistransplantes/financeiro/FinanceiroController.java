package br.org.maistransplantes.financeiro;

import java.time.YearMonth;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.org.maistransplantes.financeiro.dto.NovoLancamentoDto;
import br.org.maistransplantes.financeiro.dto.PainelFinanceiroDto;
import jakarta.validation.Valid;

@RestController     
@RequestMapping("/api/financeiro")
public class FinanceiroController {
    private final FinanceiroService service;
    public FinanceiroController(FinanceiroService service) {
        this.service = service;
    }

    @GetMapping 
    public PainelFinanceiroDto exibirPainel(
        @RequestParam YearMonth mes) {
        return service.montarPainel(mes);
    }

    @PostMapping("/lancamentos")
    @ResponseStatus(HttpStatus.CREATED)
    public void lancar(@Valid @RequestBody NovoLancamentoDto dto) {
        service.registrarLancamento(dto);
    }

    // ResponseEntity (e não só byte[]): é ele que permite definir os cabeçalhos
    // que transformam a resposta em download de arquivo.
    @GetMapping("/exportar")
    public ResponseEntity<byte[]> exportar(@RequestParam YearMonth mes) {
        // Quem gera o CSV é o service; o controller só embrulha em resposta HTTP.
        byte[] csvBytes = service.exportar(mes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
        // "attachment" faz o navegador baixar (em vez de abrir na aba), já com nome.
        // O builder ContentDisposition monta o texto do cabeçalho e cuida das aspas.
        headers.setContentDisposition(ContentDisposition.attachment()
            .filename("financeiro-" + mes + ".csv")
            .build());

        return ResponseEntity.ok().headers(headers).body(csvBytes);
    }
}
