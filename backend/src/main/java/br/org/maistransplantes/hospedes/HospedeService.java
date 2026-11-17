package br.org.maistransplantes.hospedes;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
// @Transactional do Spring (não o do jakarta): só ele tem o atributo readOnly
import org.springframework.transaction.annotation.Transactional;

import br.org.maistransplantes.common.RegraNegocioException;
import br.org.maistransplantes.hospedes.dto.HospedeDto;
import br.org.maistransplantes.hospedes.dto.NovoHospedeDto;
import br.org.maistransplantes.hospedes.dto.ResumoHospedesDto;
import br.org.maistransplantes.hospedes.enums.SituacaoClinica;

// Regras de negócio da tela de hóspedes. O controller só recebe/devolve DTOs e chama
// este service; quem fala com o banco são os repositories.
@Service
public class HospedeService {

    // Cada hospedagem ocupa 2 vagas do quarto: o paciente e o acompanhante
    // (regra da casa: nenhum paciente se hospeda sozinho).
    private static final int PESSOAS_POR_HOSPEDAGEM = 2;

    // Janela do card "saídas previstas esta semana" (mesma janela do selo "saída prevista"
    // em SituacaoHospede).
    private static final int DIAS_AVISO_SAIDA = 7;

    private final HospedagemRepository hospedagem;
    private final PacienteRepository paciente;
    private final AcompanhanteRepository acompanhante;
    private final QuartoRepository quarto;

    // Injeção por construtor: o Spring entrega os repositories prontos e os atributos
    // podem ser final (o service nunca fica "meio montado").
    public HospedeService(HospedagemRepository h, PacienteRepository p, AcompanhanteRepository a, QuartoRepository q) {
        this.hospedagem = h;
        this.paciente = p;
        this.acompanhante = a;
        this.quarto = q;
    }

    // GET /api/hospedes — quem está hospedado na data "hoje": já entrou (dataEntrada <= hoje)
    // e ainda não saiu (dataSaida nula), do mais antigo para o mais recente.
    // "hoje" vem por parâmetro (o controller passa LocalDate.now()) para a regra poder ser
    // testada com qualquer data. readOnly = true: só leitura, o Hibernate não precisa
    // vigiar alterações nas entidades.
    @Transactional(readOnly = true)
    public List<HospedeDto> listarHospedes(LocalDate hoje) {
        return hospedagem.findByDataSaidaIsNullAndDataEntradaLessThanEqualOrderByDataEntradaAsc(hoje)
            .stream().map(h -> HospedeDto.de(h, hoje)).toList();
    }

    // GET /api/hospedes/resumo — números dos cards do topo da tela.
    // Parte da mesma lista do listar() e conta em memória: a casa tem poucas dezenas de
    // vagas, então não compensa criar uma consulta de contagem para cada card.
    @Transactional(readOnly = true)
    public ResumoHospedesDto resumir(LocalDate hoje) {
        var ativas = hospedagem.findByDataSaidaIsNullAndDataEntradaLessThanEqualOrderByDataEntradaAsc(hoje);

        // Toda hospedagem tem exatamente 1 paciente e 1 acompanhante.
        long pacientes = ativas.size();
        long acompanhantes = ativas.size();
        long hospedadosAgora = pacientes + acompanhantes;

        long capacidadeTotal = quarto.somarCapacidade();

        LocalDate limiteSaida = hoje.plusDays(DIAS_AVISO_SAIDA);
        long saidasPrevistasSemana = ativas.stream()
            // dataSaidaPrevista é opcional, por isso o teste de null
            .filter(h -> h.getDataSaidaPrevista() != null && !h.getDataSaidaPrevista().isAfter(limiteSaida))
            .count();

        // A ordem dos argumentos segue a ordem dos campos do record ResumoHospedesDto.
        return new ResumoHospedesDto(
            hospedadosAgora,
            capacidadeTotal,
            pacientes,
            contarPorSituacao(ativas, SituacaoClinica.PRE_TRANSPLANTE),
            contarPorSituacao(ativas, SituacaoClinica.POS_TRANSPLANTE),
            contarPorSituacao(ativas, SituacaoClinica.INTERNADO_HC),
            acompanhantes,
            // Math.max: se o cadastro de quartos estiver incompleto, não mostra vaga negativa
            Math.max(0, capacidadeTotal - hospedadosAgora),
            saidasPrevistasSemana);
    }

    // POST /api/hospedes — registra uma nova hospedagem (paciente + acompanhante + quarto).
    // @Transactional sem readOnly: são 3 gravações (paciente, acompanhante, hospedagem);
    // se qualquer uma falhar, ou uma regra lançar exceção, o banco desfaz todas (rollback).
    @Transactional
    public HospedeDto cadastrar(NovoHospedeDto dados) {
        // findByNumero devolve Optional<Quarto>: orElseThrow tira o Quarto de dentro ou
        // lança o erro de regra (vira 422 no TratadorDeErros) quando o número não existe.
        Quarto quartoEscolhido = quarto.findByNumero(dados.quarto())
            .orElseThrow(() -> new RegraNegocioException("Quarto " + dados.quarto() + " não encontrado."));

        // Vagas já comprometidas no quarto: toda hospedagem sem data de saída, inclusive
        // as com entrada futura (a vaga já está reservada).
        long vagasOcupadas = hospedagem.countByQuartoIdAndDataSaidaIsNull(quartoEscolhido.getId())
            * PESSOAS_POR_HOSPEDAGEM;
        if (vagasOcupadas + PESSOAS_POR_HOSPEDAGEM > quartoEscolhido.getCapacidade())
            throw new RegraNegocioException("O quarto " + quartoEscolhido.getNumero() + " não tem vagas livres.");

        // A ordem importa por causa das chaves estrangeiras: o acompanhante aponta para o
        // paciente, e a hospedagem aponta para os dois.
        // Telefone e cidade de origem ainda não são pedidos no formulário, por isso null.
        var novoPaciente = paciente.save(
            new Paciente(dados.paciente(), dados.tipoTransplante(), null, null));
        var novoAcompanhante = acompanhante.save(
            new Acompanhante(dados.acompanhante(), dados.parentesco(), novoPaciente));

        // Saída prevista e saída real começam nulas: a pessoa acabou de entrar.
        var nova = hospedagem.save(new Hospedagem(novoPaciente, novoAcompanhante, quartoEscolhido,
            dados.dataEntrada(), null, null, dados.situacao()));

        // Devolve o mesmo formato da listagem, para o front poder colocar a linha na tabela.
        return HospedeDto.de(nova, LocalDate.now());
    }

    // Quantas hospedagens da lista estão em uma dada situação clínica (pré, pós, internado).
    private long contarPorSituacao(List<Hospedagem> hospedagens, SituacaoClinica situacao) {
        return hospedagens.stream().filter(h -> h.getSituacaoClinica() == situacao).count();
    }
}
