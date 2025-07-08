USE Test_RTS_IntegraX;

-- Tabela: FX_categoria
INSERT INTO FX_categoria (nome, descricao) VALUES
('Alimentaçao','Gastos com alimentação em geral'),
('!Historico!','Histórico de antigos meios de armazenagem (sem histórico)'),
('Hobbies e Lazer','Gastos com atividades de lazer e entretenimento'),
('Pet Care','Gastos relacionados a cuidados com animais de estimação'),
('Planos','Assinaturas e planos digitais (streaming, apps, etc.)'),
('Casa','Gastos relacionados à manutenção e suprimentos para o lar'),
('Salário e Salário','Rendimentos recebidos através de salário'),
('Educação','Gastos com cursos, materiais escolares e capacitação'),
('Transporte','Gastos com locomoção (combustível, passagens, manutenção de veículos, etc.)'),
('Contas','Gastos com serviços essenciais (água, luz, telefone, internet, etc.)'),
('Vestuário','Gastos com roupas, calçados e acessórios');

-- Tabela: FX_subcategoria
INSERT INTO FX_subcategoria (nome, categoria_id, descricao) VALUES
('Mercado',1,'Aquelas compras do mês que sempre esquece o principal e traz 10 pacotes de biscoito kkk'),
('!Historico!',2,'Aquela categoria misteriosa que ninguém sabe pra que servia, mas tá lá ocupando espaço kkk'),
('Final de semana',3,'Gastos típicos de sábado e domingo: rolê, cinema, passeios e aquela saidinha que vira dívida kkk'),
('Pet Care',4,'Gastos com o bichinho que come melhor que a gente (e ainda tem roupinha de inverno) kkk'),
('Netflix',5,'Assinatura que a gente paga pra ver 3 filmes por ano e ainda divide com mais 5 pessoas kkk'),
('google one',5,'Armazenamento pro celular que nunca é suficiente e a gente acaba pagando pra não apagar as fotos antigas kkk'),
('Casa',6,'Conta de luz, conserto da torneira e aquela decoração que prometeu fazer mas tá encostada desde 2022 kkk'),
('Salário e Salário',7,'Aquele dinheiro que entra e some em 2 dias pagando as contas que a gente nem lembrava kkk'),
('Taxas',8,'Matrícula, provas, certificados e aqueles boletos que aparecem do nada da faculdade kkk'),
('Uber',9,'Corrida que custa o dobro em horário de pico, mas a gente paga pra não pegar ônibus lotado kkk'),
('Celular',10,'Plano de telefone que promete internet ilimitada, mas no 5º dia do mês já tá acabando kkk'),
('Bar',3,'Aquele chopp que era pra ser só um e vira rodada, petisco e conta surpresa kkk'),
('Vestuário',11,'Roupas que a gente compra pra eventos futuros e acabam esquecidas no fundo do armário kkk');

-- Tabela: FX_conta
INSERT INTO FX_conta (nome, descricao, tipo, status_id) VALUES