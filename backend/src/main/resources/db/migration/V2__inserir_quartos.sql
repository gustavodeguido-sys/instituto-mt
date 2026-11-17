-- Quartos da casa de apoio. Dado de referência (não é dado de teste): roda em todos os
-- ambientes, inclusive produção, porque sem quartos não dá para cadastrar hóspedes.
-- capacidade = número de pessoas; cada hospedagem ocupa 2 vagas (paciente + acompanhante).
-- Alterações futuras (quarto novo, capacidade diferente) vão em uma nova migration (V3...),
-- nunca editando esta depois de aplicada.
INSERT INTO quarto (numero, capacidade) VALUES
    ('1', 4),
    ('2', 4),
    ('3', 4),
    ('4', 2),
    ('5', 2);
