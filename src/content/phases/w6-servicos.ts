import type { AppTransporte, BlocoApp, Fase, TelaApp } from '../../core/engine/stepTypes'
import { digitar, pergunta, toque } from '../transporte/passos'

const APP_SAUDE: AppTransporte = {
  id: 'saude',
  nome: 'Saúde Fácil',
  tema: { corPrincipal: '#0a6b3d', corDestaque: '#0a6b3d', link: '#0a6b3d' },
  fonte: 'Aplicativo genérico de agendamento de consulta. Estrutura de serviços públicos de saúde, sem nome nem logo reais.',
}

const APP_GOV: AppTransporte = {
  id: 'gov',
  nome: 'gov.br',
  tema: { corPrincipal: '#1b4b8f', corDestaque: '#1b4b8f', link: '#1b4b8f' },
  fonte: 'Fluxo de entrada do gov.br descrito em tutoriais oficiais. Falta conferir cada tela no site real.',
}

const APP_LOJA: AppTransporte = {
  id: 'loja',
  nome: 'Loja Online',
  tema: { corPrincipal: '#7a2e8f', corDestaque: '#7a2e8f', link: '#7a2e8f' },
  fonte: 'Loja genérica inventada. Os preços, vendedores e avaliações são de exemplo.',
}

const voltar = (id: string): ItemVoltar => ({ rotulo: 'Voltar', icone: '←', id })
type ItemVoltar = { rotulo: string; icone: string; id: string }

// ---------------------------------------------------------------- Fase 6.1: consulta
const inicioSaude = (): TelaApp => ({
  blocos: [
    { tipo: 'faixa', avatar: '{iniciais}', saudacao: 'Olá, {nome}!' },
    {
      tipo: 'atalhos',
      titulo: 'O que você precisa?',
      estilo: 'quadrados',
      itens: [
        { rotulo: 'Agendar consulta', icone: '🩺', id: 'agendar' },
        { rotulo: 'Meus exames', icone: '🧪', id: 'exames' },
        { rotulo: 'Vacinas', icone: '💉', id: 'vacinas' },
        { rotulo: 'Receitas', icone: '📋', id: 'receitas' },
      ],
    },
  ],
})

const especialidades = (): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: voltar('voltar'), titulo: 'Escolha o tipo de consulta' },
    {
      tipo: 'lista',
      itens: [
        { rotulo: 'Dentista', id: 'dentista', icone: '🦷' },
        { rotulo: 'Clínico geral', id: 'clinico', icone: '🩺', detalhe: 'Consulta de rotina' },
        { rotulo: 'Oftalmologista', id: 'oftalmo', icone: '👁️' },
        { rotulo: 'Cardiologista', id: 'cardio', icone: '❤️' },
      ],
    },
  ],
})

const horarios = (): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: voltar('voltar'), titulo: 'Clínico geral' },
    { tipo: 'texto', texto: 'Você só pode de manhã, e depois de terça-feira.' },
    {
      tipo: 'lista',
      titulo: 'Horários livres',
      itens: [
        { rotulo: 'Segunda, 9h', id: 'seg-9', icone: '🗓️' },
        { rotulo: 'Terça, 14h', id: 'ter-14', icone: '🗓️' },
        { rotulo: 'Quarta, 9h30', id: 'qua-930', icone: '🗓️' },
        { rotulo: 'Quinta, 16h', id: 'qui-16', icone: '🗓️' },
      ],
    },
  ],
})

const confirmarConsulta = (): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: voltar('voltar'), titulo: 'Confira os dados' },
    {
      tipo: 'dados',
      linhas: [
        { rotulo: 'Consulta', valor: 'Clínico geral' },
        { rotulo: 'Quando', valor: 'Quarta, 9h30' },
        { rotulo: 'Onde', valor: 'Posto de Saúde, Rua das Flores' },
      ],
    },
    { tipo: 'espaco' },
    {
      tipo: 'lista',
      estilo: 'caixas',
      itens: [
        { rotulo: 'Cancelar', id: 'cancelar', icone: '✖' },
        { rotulo: 'Confirmar consulta', id: 'confirmar', icone: '✔' },
      ],
    },
  ],
})

export const w6Consulta: Fase = {
  id: 'w6-consulta',
  mundo: 6,
  titulo: 'Marcar uma consulta',
  simulador: 'arquivos',
  aplicativo: APP_SAUDE,
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'Antes da festa, é bom cuidar da saúde, {nome}.' },
      { quem: 'neuza', texto: 'Vamos marcar uma consulta de rotina pelo aplicativo, sem fila.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Consulta marcada! Anote o dia e o horário num papel também.' }],
    premio: { emoji: '🩺', titulo: 'Saúde em dia' },
  },
  passos: [
    toque(
      'agendar',
      'Toque em "Agendar consulta".',
      inicioSaude(),
      'agendar',
      'Agendar consulta',
      'Os botões grandes levam a outros serviços.',
      'É o primeiro botão, com um estetoscópio.',
    ),
    toque(
      'tipo',
      'Você quer uma consulta de rotina. Toque em "Clínico geral".',
      especialidades(),
      'clinico',
      'Clínico geral',
      'Consulta de rotina é com o clínico geral.',
      'É o segundo da lista.',
    ),
    toque(
      'horario',
      'Leia o aviso e escolha um horário que você pode: de manhã e depois de terça.',
      horarios(),
      'qua-930',
      'Quarta, 9h30',
      'Elimine os horários da tarde e o de segunda. Sobra um só.',
      'É "Quarta, 9h30", o terceiro da lista.',
    ),
    pergunta(
      'conferir',
      'Confira os dados na tela. Em qual dia e hora é a consulta?',
      confirmarConsulta(),
      [
        { id: 'qua', rotulo: 'Quarta, 9h30' },
        { id: 'qui', rotulo: 'Quinta, 16h' },
        { id: 'seg', rotulo: 'Segunda, 9h' },
      ],
      'qua',
      ['Leia a linha "Quando".', 'Está escrito "Quarta, 9h30".'],
      'Quase! Leia a linha "Quando" da tela.',
      'Confira o dia e a hora antes de confirmar.',
    ),
    toque(
      'confirmar',
      'Está tudo certo. Toque em "Confirmar consulta".',
      confirmarConsulta(),
      'confirmar',
      'Confirmar consulta',
      '"Cancelar" desfaz o agendamento.',
      'É o botão da direita, com um ✔.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 6.2: gov.br
const site = (endereco: string, blocos: BlocoApp[], tituloBarra = 'gov.br'): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: voltar('voltar'), titulo: tituloBarra },
    { tipo: 'dados', linhas: [{ rotulo: 'Endereço', valor: endereco }] },
    ...blocos,
  ],
})

export const w6Govbr: Fase = {
  id: 'w6-govbr',
  mundo: 6,
  titulo: 'Entrar no gov.br com segurança',
  simulador: 'arquivos',
  aplicativo: APP_GOV,
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Dona {nome}, o gov.br guarda seus documentos. Mas tem site falso por aí!' },
      { quem: 'neuza', texto: 'Primeiro olhe o endereço do site. Só depois entre.' },
    ],
    fechamento: [{ quem: 'osvaldo', texto: 'Entrou pelo caminho certo. Seus documentos estão ali, na palma da mão.' }],
    premio: { emoji: '🪪', titulo: 'Documentos na mão' },
  },
  passos: [
    pergunta(
      'endereco',
      'Qual destes endereços é o do gov.br de verdade?',
      site('?', [
        { tipo: 'texto', texto: 'O endereço fica no alto da tela. O site oficial termina com .gov.br.', centro: true },
      ]),
      [
        { id: 'falso1', rotulo: 'acesso-govbr.com' },
        { id: 'certo', rotulo: 'acesso.gov.br' },
        { id: 'falso2', rotulo: 'gov-br.net/entrar' },
      ],
      'certo',
      ['O site oficial termina com .gov.br.', 'É "acesso.gov.br". Os outros terminam em .com ou .net.'],
      'Quase! O oficial termina com .gov.br.',
      'Confira o final do endereço: sites do governo terminam em .gov.br.',
    ),
    toque(
      'entrar',
      'Endereço conferido. Toque em "Entrar com gov.br".',
      site('acesso.gov.br', [
        {
          tipo: 'lista',
          estilo: 'caixas',
          itens: [
            { rotulo: 'Criar conta', icone: '➕', id: 'criar' },
            { rotulo: 'Entrar com gov.br', icone: '🔑', id: 'entrar' },
          ],
        },
      ]),
      'entrar',
      'Entrar com gov.br',
      'Se você já tem conta, é "Entrar".',
      'É o botão da direita, com uma chave.',
    ),
    {
      ...digitar(
        'cpf',
        'Escreva o CPF de exemplo: 111.222.333-44',
        site('acesso.gov.br', [{ tipo: 'campo', icone: '🪪' }]),
        '111.222.333-44',
        'CPF',
        'Continuar',
        'O CPF é o número dos seus documentos. Este é só para treinar.',
      ),
      teclado: 'numero',
    },
    toque(
      'como-entrar',
      'Escolha a forma mais segura: "Entrar com o aplicativo gov.br".',
      site('acesso.gov.br', [
        {
          tipo: 'lista',
          itens: [
            { rotulo: 'Entrar só com a senha', icone: '🔓', id: 'senha' },
            { rotulo: 'Entrar com o aplicativo gov.br', icone: '📲', id: 'app', detalhe: 'Mais seguro' },
            { rotulo: 'Pedir ajuda por e-mail', icone: '✉️', id: 'email' },
          ],
        },
      ]),
      'app',
      'Entrar com o aplicativo gov.br',
      'A forma marcada como "Mais seguro" protege melhor a sua conta.',
      'É a do meio, com um selinho "Mais seguro".',
    ),
    toque(
      'servico',
      'Você entrou! Toque em "Carteira de Vacinação".',
      site(
        'www.gov.br',
        [
          {
            tipo: 'atalhos',
            titulo: 'Meus serviços',
            estilo: 'quadrados',
            itens: [
              { rotulo: 'Carteira de Trabalho', icone: '💼', id: 'ctps' },
              { rotulo: 'Carteira de Vacinação', icone: '💉', id: 'vacinacao' },
              { rotulo: 'Imposto de Renda', icone: '🧾', id: 'ir' },
            ],
          },
        ],
        'Meus serviços',
      ),
      'vacinacao',
      'Carteira de Vacinação',
      'Cada quadrado é um serviço diferente.',
      'É o do meio, com uma seringa.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 6.3: compra
const loja = (blocos: BlocoApp[], titulo = 'Loja Online'): TelaApp => ({
  blocos: [{ tipo: 'barra', voltar: voltar('voltar'), titulo }, ...blocos],
})

const ofertas = (): TelaApp =>
  loja(
    [
      {
        tipo: 'lista',
        titulo: 'Caixa de bombons',
        itens: [
          { rotulo: 'R$ 9,90 · Vendedor novo', id: 'barata', icone: '🍫', detalhe: 'Sem avaliações · 0 vendas' },
          { rotulo: 'R$ 39,90 · Doce Casa', id: 'confiavel', icone: '🍫', detalhe: '4,8 estrelas · 1.230 vendas' },
          { rotulo: 'R$ 69,90 · Mega Presentes', id: 'cara', icone: '🍫', detalhe: '4,7 estrelas · 980 vendas' },
        ],
      },
    ],
    'Resultados para "bombons"',
  )

const pagar = (): TelaApp =>
  loja(
    [
      {
        tipo: 'dados',
        titulo: 'Resumo',
        linhas: [
          { rotulo: 'Produto', valor: 'R$ 39,90' },
          { rotulo: 'Frete', valor: 'R$ 12,00' },
          { rotulo: 'Total', valor: 'R$ 51,90' },
        ],
      },
      { tipo: 'espaco' },
      {
        tipo: 'lista',
        estilo: 'caixas',
        itens: [
          { rotulo: 'Cancelar', id: 'cancelar', icone: '✖' },
          { rotulo: 'Pagar R$ 51,90', id: 'pagar', icone: '✔' },
        ],
      },
    ],
    'Pagamento',
  )

export const w6Compra: Fase = {
  id: 'w6-compra',
  mundo: 6,
  titulo: 'Comprar um presente com cuidado',
  simulador: 'arquivos',
  aplicativo: APP_LOJA,
  historia: {
    abertura: [
      { quem: 'ana', texto: 'Vó, que tal levar uma caixa de bombons para a festa?' },
      { quem: 'neuza', texto: 'Compre pela loja online. Mas atenção: preço bom demais é suspeito.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Compra segura! Você olhou o vendedor, o preço e o frete.' }],
    premio: { emoji: '🛍️', titulo: 'Compra com cabeça' },
  },
  passos: [
    digitar(
      'buscar',
      'Na busca da loja, escreva: bombons',
      loja([{ tipo: 'campo', icone: '🔍' }]),
      'bombons',
      'Buscar',
      'Buscar',
      'Escreva o que você quer comprar.',
    ),
    toque(
      'desconfiar',
      'Uma oferta é barata demais e o vendedor não tem avaliações. Toque nela para ver o perigo.',
      ofertas(),
      'barata',
      'R$ 9,90 · Vendedor novo',
      'Veja o preço e as avaliações de cada vendedor.',
      'A de R$ 9,90 tem zero vendas e zero avaliações.',
    ),
    toque(
      'voltar-lista',
      'Cuidado: não compre dele. Toque na seta para voltar às ofertas.',
      loja([{ tipo: 'cartao', titulo: 'Vendedor novo', texto: '0 vendas · 0 avaliações · pede o pagamento fora da loja' }], 'Oferta de R$ 9,90'),
      'voltar',
      'Voltar',
      'Preço baixo demais e vendedor sem avaliação: desconfie.',
      'É a seta ← no alto da tela.',
    ),
    toque(
      'escolher',
      'Escolha a oferta confiável: "R$ 39,90 · Doce Casa".',
      ofertas(),
      'confiavel',
      'R$ 39,90 · Doce Casa',
      'Vendedor com muitas vendas e nota alta é mais seguro.',
      'É a do meio, com 4,8 estrelas.',
    ),
    pergunta(
      'total',
      'Olhe o resumo: quanto você vai pagar no total, com o frete?',
      pagar(),
      [
        { id: '39', rotulo: 'R$ 39,90' },
        { id: '51', rotulo: 'R$ 51,90' },
        { id: '12', rotulo: 'R$ 12,00' },
      ],
      '51',
      ['Some o produto e o frete.', 'O total está escrito na última linha.'],
      'Quase! O total é a soma: produto mais frete.',
      'O frete pode mudar o preço final. Veja o total.',
    ),
    toque(
      'pagar',
      'O total está certo. Toque em "Pagar R$ 51,90".',
      pagar(),
      'pagar',
      'Pagar R$ 51,90',
      '"Cancelar" desiste da compra.',
      'É o botão da direita, com um ✔.',
    ),
  ],
}

export const fasesMundo6: Fase[] = [w6Consulta, w6Govbr, w6Compra]
