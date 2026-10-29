// Telas do Inter, copiadas da ESTRUTURA de 8 capturas reais do aplicativo (out/2026): início, Pix, Pagar com Pix,
// Valor a pagar, Revisão e a confirmação "iSafe". Só desenho e textos; sem logos, sem fontes e sem dados de ninguém.
// Ainda faltam: o que aparece depois do "CONFIRMAR" (biometria?) e o comprovante.

import type { BlocoApp, ContextoTela, TelaApp, TelasBanco } from '../../../core/engine/stepTypes'

const nav: BlocoApp = { tipo: 'navegacao', ativo: 0, itens: [
  { rotulo: 'Início', icone: '🏠' },
  { rotulo: 'Invest', icone: '📈' },
  { rotulo: 'Forum', icone: '💬' },
  { rotulo: 'Shop', icone: '🛍' },
  { rotulo: 'Todos', icone: '☰' },
] }

const saldoLinha = (c: ContextoTela): BlocoApp => ({
    tipo: 'saldo',
    linha: true,
    rotulo: 'Saldo em conta',
    valor: c.saldoVisivel ? c.saldo : 'R$ •••••',
    olho: { rotulo: 'Mostrar saldo', icone: '👁', id: 'olho-saldo', inerte: true },
})

function revisao(c: ContextoTela, modo: 'perguntar' | 'pagar', extra?: Partial<TelaApp>): TelaApp {
  const ativo = modo === 'pagar'
  return {
    escuro: true,
    ...extra,
    blocos: [
      { tipo: 'barra', titulo: 'Revisão', voltar: ativo ? { rotulo: 'Voltar', id: 'cancelar' } : true },
      saldoLinha(c),
      { tipo: 'destaque', valor: `R$ ${c.valor}`, nome: c.nomeDestino, chip: { rotulo: 'Sem categoria', inerte: true } },
      { tipo: 'cartao', titulo: 'Agora', texto: '{hoje}', link: 'Pagamento recorrente' },
      { tipo: 'titulo', texto: 'Forma de pagamento' },
      { tipo: 'cartao', titulo: 'Débito Inter' },
      {
        tipo: 'dados',
        titulo: 'Quem vai receber',
        linhas: [
          { rotulo: 'Nome', valor: c.nomeDestino },
          { rotulo: 'CPF/CNPJ', valor: '•••.456.789-••' },
          { rotulo: 'Instituição', valor: 'Banco Exemplo' },
          { rotulo: 'Chave de e-mail', valor: c.email },
        ],
      },
      { tipo: 'texto', texto: 'Adicionar mensagem', link: true },
      { tipo: 'botao', item: ativo ? { rotulo: `Pagar R$ ${c.valor}`, id: 'confirmar' } : { rotulo: `Pagar R$ ${c.valor}`, inerte: true } },
    ],
  }
}

export const telasInter: TelasBanco = {
  rotuloCampoChave: 'Chave, Copia e Cola ou Perfil do Fórum',
  dicas: {
    saldo: 'Procure o desenho de um olho riscado, no alto da tela, do lado direito.',
    pix: 'Logo abaixo do saldo há três botões em forma de pílula: Pix, Pagar e Cartões. Toque no primeiro, o Pix.',
    caminho: ['São duas caixas grandes no alto da tela: a primeira é "Pagar" e a segunda é "Receber".'],
    confirmar: 'É o botão laranja na parte de baixo da tela. Se não aparecer, role a tela para baixo.',
    cancelar: 'É a seta ← no canto de cima, à esquerda.',
    autenticar: 'O botão CONFIRMAR fica na parte de baixo, dentro do quadro que apareceu.',
  },

  inicio: (c) => ({
    escuro: true,
    blocos: [
      {
        tipo: 'barra',
        voltar: { rotulo: 'Perfil', icone: '👤', inerte: true },
        acoes: [
          c.saldoVisivel
            ? { rotulo: 'Esconder saldo', icone: '👁', id: 'esconder-saldo' }
            : { rotulo: 'Mostrar saldo', icone: '👁', id: 'ver-saldo' },
          { rotulo: 'Ajuda', icone: '❔', inerte: true },
          { rotulo: 'Brasil', icone: '🇧🇷', inerte: true },
        ],
      },
      { tipo: 'busca', texto: 'Busque na Sev' },
      { tipo: 'promo', titulo: 'Continue sua jornada global', texto: 'Descobrir como comprar dólar' },
      { tipo: 'saldo', rotulo: 'Saldo', valor: c.saldoVisivel ? c.saldo : 'R$ •••••' },
      {
        tipo: 'fichas',
        itens: [{ rotulo: 'Pix', icone: '◈', id: 'pix' }, { rotulo: 'Pagar' }, { rotulo: 'Cartões' }],
      },
      {
        tipo: 'atalhos',
        estilo: 'caixas',
        itens: [
          { rotulo: 'Parcele sem cartão', icone: '🧾', etiqueta: 'Até 24x' },
          { rotulo: 'Tesouro Direto', icone: '📦' },
          { rotulo: 'Fundos', icone: '💼' },
        ],
      },
      nav,
    ],
  }),

  caminho: [
    () => ({
      escuro: true,
      blocos: [
        { tipo: 'barra', titulo: 'Pix', voltar: true },
        {
          tipo: 'lista',
          estilo: 'caixas',
          itens: [{ rotulo: 'Pagar', id: 'caminho-0' }, { rotulo: 'Receber' }],
        },
        {
          tipo: 'atalhos',
          estilo: 'redondos',
          itens: [
            { rotulo: 'Cadastrar chave Pix', icone: '🔑' },
            { rotulo: 'Pix Automático', icone: '🔁' },
            { rotulo: 'Ajuda Pix', icone: '💬' },
            { rotulo: 'Contestar Pix', icone: '⚠️', etiqueta: 'Novo' },
            { rotulo: 'Pix Saque e Pix Troco', icone: '💵' },
          ],
        },
        { tipo: 'promo', titulo: 'Receba cashback em grandes marcas com Gift Cards' },
        { tipo: 'cartao', titulo: 'Conheça o Seguro Pix', texto: 'Proteção turbinada para suas transações.', link: 'Saiba mais' },
      ],
    }),
  ],

  chave: () => ({
    escuro: true,
    blocos: [
      { tipo: 'barra', titulo: 'Pagar com Pix', voltar: true },
      { tipo: 'titulo', texto: 'Para quem você quer pagar?', acao: { rotulo: 'Colar', inerte: true } },
      { tipo: 'campo' },
      {
        tipo: 'atalhos',
        titulo: 'Outros pagamentos',
        estilo: 'caixas',
        itens: [
          { rotulo: 'Escanear', icone: '📷', etiqueta: 'Novo' },
          { rotulo: 'Pix Copia e Cola', icone: '📋' },
          { rotulo: 'Agência e conta', icone: '🏦' },
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Favoritos',
        acao: { rotulo: 'Acessar todos', inerte: true },
        itens: [
          { rotulo: 'Rogério Almeida Lima', inerte: true },
          { rotulo: 'Patrícia Gomes Rocha', inerte: true },
        ],
      },
    ],
  }),

  valor: (c) => ({
    escuro: true,
    blocos: [
      { tipo: 'barra', titulo: 'Valor a pagar', voltar: true },
      saldoLinha(c),
      { tipo: 'campo', valor: true, entre: ['Pagar para', c.nomeDestino] },
    ],
  }),

  revisao,

  autenticar: (c) => ({
    ...revisao(c, 'perguntar', { escurecida: true }),
    blocos: [
      ...revisao(c, 'perguntar').blocos,
      { tipo: 'folha', texto: 'Clique em confirmar para autenticar sua transação pelo iSafe', botao: { rotulo: 'CONFIRMAR', id: 'autenticar' } },
    ],
  }),
}
