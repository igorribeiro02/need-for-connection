// Telas do Mercado Pago, copiadas da ESTRUTURA de 2 capturas reais (out/2026): início e a tela "Pix".
// Ainda faltam: como continuar depois de escrever a chave, valor, revisão, confirmação e comprovante (usam a tela genérica).

import type { TelasBanco } from '../../../core/engine/stepTypes'

export const telasMercadoPago: TelasBanco = {
  rotuloCampoChave: 'Informe o que você quer fazer',
  dicas: {
    saldo: 'O desenho do olho fica ao lado de "R$ ***", no cartão branco do alto.',
    pix: 'Na barra de baixo, o botão do meio é o Pix (um losango). Ele é maior que os outros.',
    confirmar: 'É o botão grande na parte de baixo da tela.',
  },

  inicio: (c) => ({
    blocos: [
      {
        tipo: 'faixa',
        avatar: '🤝',
        saudacao: 'Olá, {nome}',
        acoes: [{ rotulo: 'Buscar', icone: '🔍', inerte: true }, { rotulo: 'Avisos', icone: '🔔', inerte: true }],
      },
      { tipo: 'abas', itens: ['Saldo', 'Cofrinhos', 'Investimentos', 'Cripto'], ativa: 0 },
      {
        tipo: 'saldo',
        rotulo: '',
        valor: c.saldoVisivel ? c.saldo : 'R$ ***',
        olho: c.saldoVisivel
          ? { rotulo: 'Esconder saldo', icone: '👁', id: 'esconder-saldo' }
          : { rotulo: 'Mostrar saldo', icone: '👁', id: 'ver-saldo' },
        apoio: c.saldoVisivel ? 'Rendeu R$ 12,40 nos últimos 11 meses' : 'Rendeu R$ *** nos últimos 11 meses',
      },
      { tipo: 'promo', titulo: 'Falta depositar R$ 1.000 este mês para ter 105% do CDI.', botao: { rotulo: 'Depositar', principal: true } },
      { tipo: 'titulo', texto: 'Cartão de crédito' },
      { tipo: 'promo', escura: true, titulo: 'Sem anuidade. Saiba como pedir seu cartão', botao: { rotulo: 'Pedir cartão', principal: true } },
      { tipo: 'titulo', texto: 'Empréstimos', acao: { rotulo: 'Consultar →' } },
      {
        tipo: 'navegacao',
        ativo: 0,
        central: 2,
        itens: [
          { rotulo: 'Conta', icone: '🏛' },
          { rotulo: 'Cartões', icone: '💳' },
          { rotulo: 'Pix', icone: '◈', id: 'pix' },
          { rotulo: 'Pagamentos', icone: '🔳' },
          { rotulo: 'Mais', icone: '☰' },
        ],
      },
    ],
  }),

  chave: () => ({
    blocos: [
      {
        tipo: 'barra',
        titulo: 'Pix',
        grande: 'linha',
        acoes: [{ rotulo: 'Chaves', icone: '🔑', inerte: true }, { rotulo: 'Atalhos', icone: '▦', inerte: true }],
      },
      { tipo: 'campo', icone: '🔳' },
      { tipo: 'titulo', texto: 'Todos os contatos' },
      { tipo: 'lista', itens: [{ rotulo: 'Marcos Vinícius', detalhe: 'Contato de exemplo', icone: '🙂', inerte: true }] },
      {
        tipo: 'navegacao',
        ativo: 2,
        central: 2,
        itens: [
          { rotulo: 'Conta', icone: '🏛' },
          { rotulo: 'Cartões', icone: '💳' },
          { rotulo: 'Pix', icone: '◈' },
          { rotulo: 'Pagamentos', icone: '🔳' },
          { rotulo: 'Mais', icone: '☰' },
        ],
      },
    ],
  }),
}
