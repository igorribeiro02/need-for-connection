// Telas do PicPay, copiadas da ESTRUTURA de 3 capturas reais (out/2026): início, "Área Pix" e "Escolha pra quem transferir".
// Ainda faltam as telas seguintes (valor, revisão, confirmação e comprovante): por enquanto usam a tela genérica.

import type { TelasBanco } from '../../../core/engine/stepTypes'

export const telasPicPay: TelasBanco = {
  rotuloCampoChave: 'CPF, CNPJ, chave Pix ou nome',
  dicas: {
    saldo: 'O desenho do olho fica dentro do cartão "Conta", do lado direito.',
    pix: 'Procure "Pix" no grupo "Pro dia a dia": é o primeiro botão, o verde.',
    caminho: ['É o primeiro botão de cima, o verde, com uma setinha.'],
    confirmar: 'É o botão grande na parte de baixo da tela.',
  },

  inicio: (c) => ({
    blocos: [
      {
        tipo: 'faixa',
        avatar: '{iniciais}',
        busca: 'Buscar',
        acoes: [
          { rotulo: 'Ajuda', icone: '❔', inerte: true },
          { rotulo: 'Mensagens', icone: '💬', inerte: true },
          { rotulo: 'Avisos', icone: '🔔', inerte: true },
        ],
        contas: [{ rotulo: 'PicPay', icone: '🟢', inerte: true }, { rotulo: 'Adicionar conta', inerte: true }],
      },
      {
        tipo: 'saldo',
        rotulo: 'Conta',
        extrato: 'Ver extrato',
        valor: c.saldoVisivel ? c.saldo : '••••••',
        olho: c.saldoVisivel
          ? { rotulo: 'Esconder saldo', icone: '👁', id: 'esconder-saldo' }
          : { rotulo: 'Mostrar saldo', icone: '👁', id: 'ver-saldo' },
        apoio: 'Pode render 102% do CDI',
        botao: { rotulo: 'Trazer saldo', inerte: true },
      },
      { tipo: 'promo', escura: true, titulo: 'Use o assistente do app para fazer Pix, pagar boletos e organizar suas finanças' },
      {
        tipo: 'atalhos',
        titulo: 'Pro dia a dia',
        estilo: 'quadrados',
        itens: [
          { rotulo: 'Pix', icone: '◈', id: 'pix', principal: true },
          { rotulo: 'Pagamentos', icone: '🧾' },
          { rotulo: 'Cofrinhos', icone: '🐷' },
          { rotulo: 'Cartão de transporte', icone: '🚌' },
        ],
      },
      { tipo: 'promo', titulo: 'Cartão', botao: { rotulo: 'Pagar', icone: '🔳' } },
      {
        tipo: 'navegacao',
        ativo: 0,
        itens: [
          { rotulo: 'Início', icone: '🏠' },
          { rotulo: 'Cartão', icone: '💳' },
          { rotulo: 'Empréstimos', icone: '🤝' },
          { rotulo: 'Shop', icone: '🛍' },
          { rotulo: 'Menu', icone: '☰' },
        ],
      },
    ],
  }),

  caminho: [
    () => ({
      blocos: [
        { tipo: 'barra', titulo: 'Área Pix', grande: 'abaixo', voltar: true, acoes: [{ rotulo: 'Ajuda', icone: '❔', inerte: true }] },
        {
          tipo: 'atalhos',
          estilo: 'quadrados',
          itens: [
            { rotulo: 'Transferir', icone: '↗', id: 'caminho-0', principal: true, etiqueta: 'EM ATÉ 12X' },
            { rotulo: 'Pagar QR Code', icone: '🔳' },
            { rotulo: 'Pix no WhatsApp', icone: '💬' },
            { rotulo: 'Pix por Aproximação', icone: '🎙' },
          ],
        },
        { tipo: 'titulo', texto: 'Meus cartões pra fazer Pix', apoio: 'Adicione cartões de crédito de qualquer banco.' },
        {
          tipo: 'atalhos',
          estilo: 'caixas',
          itens: [{ rotulo: 'Adicionar', icone: '➕' }, { rotulo: '•••• 0000', icone: '💳' }],
        },
        { tipo: 'titulo', texto: 'Meus contatos' },
        { tipo: 'lista', itens: [{ rotulo: 'Marcos Vinícius', detalhe: 'Contato de exemplo', icone: '🙂', inerte: true }] },
      ],
    }),
  ],

  chave: () => ({
    blocos: [
      { tipo: 'barra', titulo: 'Escolha pra quem transferir', grande: 'abaixo', voltar: true },
      { tipo: 'campo', icone: '🔳' },
      { tipo: 'lista', itens: [{ rotulo: 'Fazer Pix com agência e conta', inerte: true }] },
      { tipo: 'fichas', ativa: 0, itens: [{ rotulo: 'Recentes', inerte: true }, { rotulo: 'Favoritos', inerte: true }, { rotulo: 'Contatos', icone: '📇', inerte: true }] },
      { tipo: 'texto', centro: true, texto: 'As pessoas que você pagar irão aparecer aqui. Faça seu primeiro Pix e parcele em até 12x.' },
    ],
  }),
}
