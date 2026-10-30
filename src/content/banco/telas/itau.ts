// Telas do Itaú, copiadas da ESTRUTURA de 5 capturas reais (out/2026): início, "Pix e transferir", "Para quem você vai
// transferir?", "Quanto você vai transferir?" (já mostra o nome de quem recebe) e "Escolha como quer transferir".
// Ainda faltam: a tela de revisão/confirmação, a senha (ou biometria) e o comprovante: usam a tela genérica.
// Não copiamos as sugestões de valor (R$7,00, R$9,00), que são personalizadas.

import type { BlocoApp, ContextoTela, TelasBanco } from '../../../core/engine/stepTypes'

const nav: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  ativoCheio: true,
  itens: [
    { rotulo: 'Início', icone: '🏠' },
    { rotulo: 'Extrato', icone: '☰' },
    { rotulo: 'Pagamentos', icone: '⇄' },
    { rotulo: 'Pra você', icone: '🎁' },
    { rotulo: 'Menu', icone: '▦' },
  ],
}

const olhoFechado = { rotulo: 'Saldo escondido', icone: '👁', inerte: true }

/** Tela "Quanto você vai transferir?": mostra o nome de quem vai receber, por isso também serve de conferência. */
function quanto(c: ContextoTela) {
  return {
    blocos: [
      {
        tipo: 'barra',
        voltar: { rotulo: 'Voltar', id: 'cancelar' },
        acoes: [olhoFechado],
        titulo: 'Quanto você vai transferir?',
        sobretitulo: `Transferir para ${c.nomeDestino}`,
        grande: 'abaixo',
      },
      { tipo: 'texto', texto: `Saldo em conta: ${c.saldoVisivel ? c.saldo : 'R$ ••••'}` },
      { tipo: 'campo', valor: 'esquerda' },
    ] as BlocoApp[],
  }
}

export const telasItau: TelasBanco = {
  rotuloCampoChave: 'Digite a chave Pix ou nome',
  rotuloConta: 'Conta Itaú',
  dicas: {
    saldo: 'O desenho do olho fica ao lado de "Meu Itaú", no canto de cima, à direita.',
    pix: 'Na fileira de atalhos redondos, o primeiro é "Pix e transferir".',
    caminho: ['É o botão laranja, grande, na parte de baixo da tela.'],
    conta: 'Fica na parte de baixo da tela: um quadro com "Conta Itaú" e o seu saldo.',
    cancelar: 'É a seta < no canto de cima, à esquerda.',
    confirmar: 'É o botão grande na parte de baixo da tela.',
  },

  inicio: (c) => ({
    blocos: [
      {
        tipo: 'faixa',
        avatar: '{iniciais}',
        acoes: [
          { rotulo: 'Nível 2', icone: '⭐', inerte: true },
          { rotulo: 'Buscar', icone: '🔍', inerte: true },
          { rotulo: 'Avisos', icone: '🔔', inerte: true },
          { rotulo: 'Mensagens', icone: '💬', inerte: true },
        ],
      },
      {
        tipo: 'titulo',
        texto: 'Meu Itaú',
        acao: c.saldoVisivel
          ? { rotulo: 'Esconder saldo', icone: '👁', id: 'esconder-saldo' }
          : { rotulo: 'Mostrar saldo', icone: '👁', id: 'ver-saldo' },
      },
      {
        tipo: 'atalhos',
        estilo: 'quadrados',
        itens: [
          { rotulo: 'Pix e transferir', icone: '◈', id: 'pix' },
          { rotulo: 'Pagar', icone: '▥' },
          { rotulo: 'Conectar Contas', icone: '◔' },
          { rotulo: 'Cofrinhos', icone: '🐷' },
          { rotulo: 'Itaú Shop', icone: '🛍' },
        ],
      },
      {
        tipo: 'saldo',
        rotulo: 'Conta corrente · Saldo',
        valor: c.saldoVisivel ? c.saldo : 'R$ ••••',
        apoio: 'Limite disponível  R$ 100,00',
      },
      { tipo: 'cartao', titulo: 'Cartão de crédito', texto: 'Cartões com os benefícios de ser Itaú. Aproveite!' },
      { tipo: 'cartao', titulo: 'Investimentos' },
      nav,
    ],
  }),

  caminho: [
    () => ({
      blocos: [
        { tipo: 'barra', titulo: 'Pix e transferir', grande: 'abaixo', voltar: true, acoes: [{ rotulo: 'Ajuda', icone: '❔', inerte: true }] },
        {
          tipo: 'atalhos',
          estilo: 'quadrados',
          itens: [
            { rotulo: 'Ler QR Code', icone: '📷' },
            { rotulo: 'Pix Copia e Cola', icone: '📋' },
            { rotulo: 'Minhas Chaves', icone: '🔑' },
            { rotulo: 'Gerar QR Code', icone: '🔳' },
          ],
        },
        {
          tipo: 'lista',
          titulo: 'Sugestões pra você',
          itens: [
            { rotulo: 'Minhas contas', icone: '👤', inerte: true },
            { rotulo: 'Rogério Almeida Lima', detalhe: 'Nubank', icone: '🟣', inerte: true },
            { rotulo: 'Patrícia Gomes Rocha', detalhe: 'Mercado Pago', icone: '🤝', inerte: true },
          ],
        },
        { tipo: 'espaco' },
        { tipo: 'botao', item: { rotulo: 'Nova transferência  +', id: 'caminho-0' } },
      ],
    }),
  ],

  chave: () => ({
    blocos: [
      { tipo: 'barra', titulo: 'Para quem você vai transferir?', grande: 'abaixo', voltar: true },
      { tipo: 'campo' },
      {
        tipo: 'lista',
        itens: [
          { rotulo: 'Ler QR Code', icone: '📷', inerte: true },
          { rotulo: 'Informar agência e conta', icone: '🏦', inerte: true },
        ],
      },
    ],
  }),

  valor: quanto,

  conta: (c) => ({
    blocos: [
      {
        tipo: 'barra',
        voltar: true,
        acoes: [olhoFechado],
        titulo: `Escolha como quer transferir o valor de R$ ${c.valor}`,
        grande: 'abaixo',
      },
      { tipo: 'espaco' },
      {
        tipo: 'lista',
        estilo: 'caixas',
        itens: [
          {
            rotulo: 'Conta Itaú',
            detalhe: `Saldo ${c.saldo} · Limite da Conta R$ 100,00`,
            icone: '🏦',
            id: 'corrente',
          },
        ],
      },
    ],
  }),
}
