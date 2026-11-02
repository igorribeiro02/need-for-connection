// Telas do Santander, copiadas da ESTRUTURA de 5 capturas reais (nov/2026): início, "Pix e pagar", "Definir transferência"
// (valor), "Forma de pagamento" e "Revisão". Nomes, contas e valores das capturas foram trocados por dados inventados.
// Ainda faltam: o que vem depois de "Confirmar e transferir" (senha ou biometria) e o comprovante: usam a tela genérica.
// Simplificação: no app real, "Forma de pagamento" pede um toque em "Continuar" depois de escolher; aqui o toque na conta já avança.

import type { BlocoApp, ContextoTela, TelaApp, TelasBanco } from '../../../core/engine/stepTypes'

const nav: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Início', icone: '🏠' },
    { rotulo: 'Pix e pagar', icone: '⇪', inerte: true },
    { rotulo: 'Cartões', icone: '💳' },
    { rotulo: 'Chat', icone: '💬' },
  ],
}

function revisao(c: ContextoTela, modo: 'perguntar' | 'pagar'): TelaApp {
  const ativo = modo === 'pagar'
  return {
    blocos: [
      { tipo: 'barra', titulo: 'Revisão', voltar: ativo ? { rotulo: 'Voltar', id: 'cancelar' } : true },
      { tipo: 'titulo', texto: `Confirmar pagamento para ${c.nomeDestino}` },
      {
        tipo: 'dados',
        linhas: [
          { rotulo: 'Valor', valor: `R$ ${c.valor}` },
          { rotulo: 'Quando vai ser feito', valor: 'Hoje' },
          { rotulo: 'Tipo de pagamento', valor: 'Pix' },
          { rotulo: 'Forma de pagamento', valor: 'Saldo em conta' },
          { rotulo: 'Chave', valor: c.email },
        ],
      },
      { tipo: 'espaco' },
      { tipo: 'botao', item: ativo ? { rotulo: 'Confirmar e transferir', id: 'confirmar' } : { rotulo: 'Confirmar e transferir', inerte: true } },
    ],
  }
}

export const telasSantander: TelasBanco = {
  rotuloCampoChave: 'Chave Pix, nome, cód de barras…',
  rotuloConta: 'Saldo em conta',
  dicas: {
    saldo: 'O desenho do olho fica no alto da tela, na parte vermelha, entre a lupa e o sininho.',
    pix: 'Na parte vermelha, o primeiro botão redondo é "Pix e pagar".',
    conta: 'É o quadro com "Saldo em conta", no alto da tela.',
    cancelar: 'É a seta < no canto de cima, à esquerda.',
    confirmar: 'É o botão vermelho grande na parte de baixo da tela.',
  },

  inicio: (c) => ({
    blocos: [
      {
        tipo: 'faixa',
        saudacao: 'Santander',
        acoes: [
          { rotulo: 'Buscar', icone: '🔍', inerte: true },
          c.saldoVisivel
            ? { rotulo: 'Esconder saldo', icone: '👁', id: 'esconder-saldo' }
            : { rotulo: 'Mostrar saldo', icone: '👁', id: 'ver-saldo' },
          { rotulo: 'Avisos', icone: '🔔', inerte: true },
        ],
      },
      { tipo: 'abas', itens: ['Santander', 'Outros Bancos'], ativa: 0 },
      {
        tipo: 'saldo',
        rotulo: 'Saldo Total',
        valor: c.saldoVisivel ? c.saldo : 'R$ ••••',
        apoio: 'Saldo + limite R$ ••••',
        extrato: 'Acessar extrato',
      },
      {
        tipo: 'atalhos',
        estilo: 'redondos',
        itens: [
          { rotulo: 'Pix e pagar', icone: '◈', id: 'pix' },
          { rotulo: 'Empréstimos', icone: '💲' },
          { rotulo: 'DinDin', icone: '🍀', etiqueta: 'OFERTA' },
          { rotulo: 'Mais ações rápidas', icone: '•••' },
        ],
      },
      { tipo: 'cartao', titulo: 'Aproveite as ofertas com mais proteção para suas compras', link: 'Conhecer o seguro' },
      { tipo: 'titulo', texto: 'Minhas contas' },
      nav,
    ],
  }),

  chave: () => ({
    blocos: [
      { tipo: 'barra', titulo: 'Pix e pagar', voltar: true, acoes: [{ rotulo: 'Ajuda', icone: '❔', inerte: true }] },
      {
        tipo: 'atalhos',
        estilo: 'redondos',
        itens: [
          { rotulo: 'Área Pix', icone: '◈' },
          { rotulo: 'Fatura do cartão', icone: '🧾' },
          { rotulo: 'Meus boletos', icone: '▥' },
          { rotulo: 'Mais ações rápidas', icone: '•••' },
        ],
      },
      { tipo: 'titulo', texto: 'Você quer pagar ou transferir?', apoio: 'Faça Pix, pague boletos, tudo por aqui.' },
      { tipo: 'campo', icone: '📷' },
      {
        tipo: 'lista',
        titulo: 'Transfira novamente',
        itens: [
          { rotulo: 'Lúcia S.', detalhe: 'Celular', icone: 'LS', inerte: true },
          { rotulo: 'Marcos V.', detalhe: 'E-mail', icone: 'MV', inerte: true },
        ],
      },
      nav,
    ],
  }),

  valor: (c) => ({
    blocos: [
      { tipo: 'barra', titulo: 'Definir transferência', voltar: true },
      { tipo: 'titulo', texto: 'Quanto você vai enviar?' },
      {
        tipo: 'dados',
        titulo: `Para ${c.nomeDestino}`,
        linhas: [
          { rotulo: 'Instituição', valor: 'Banco Exemplo' },
          { rotulo: 'Chave', valor: c.email },
        ],
      },
      { tipo: 'campo', valor: 'esquerda' },
      { tipo: 'texto', texto: `Saldo em conta: ${c.saldoVisivel ? c.saldo : 'R$ ••••'}` },
    ],
  }),

  conta: () => ({
    blocos: [
      { tipo: 'barra', titulo: 'Forma de pagamento', voltar: true },
      { tipo: 'titulo', texto: 'Como você quer pagar?', apoio: 'Principais formas de pagamento' },
      {
        tipo: 'lista',
        estilo: 'caixas',
        itens: [{ rotulo: 'Saldo em conta', detalhe: 'Conta corrente 0000000-0 · Saldo R$ ••••', icone: '🏦', id: 'corrente' }],
      },
    ],
  }),

  revisao,
}
