-- Padroniza os números dos quartos com dois dígitos ('01'...'04'), que é como o
-- formulário do front os oferece (lista de seleção, sem digitação), e remove o quarto 5,
-- que não existe na casa.
-- Nova migration em vez de editar a V2: a V2 já foi aplicada, e alterá-la mudaria o
-- checksum guardado pelo Flyway (a aplicação não subiria).
-- A hospedagem aponta para quarto.id (não para o número), então renomear é seguro.
UPDATE quarto SET numero = '01' WHERE numero = '1';
UPDATE quarto SET numero = '02' WHERE numero = '2';
UPDATE quarto SET numero = '03' WHERE numero = '3';
UPDATE quarto SET numero = '04' WHERE numero = '4';

-- Só apaga se nenhuma hospedagem usar o quarto 5 (senão a chave estrangeira impediria).
DELETE FROM quarto
WHERE numero = '5'
  AND NOT EXISTS (SELECT 1 FROM hospedagem WHERE hospedagem.quarto_id = quarto.id);
