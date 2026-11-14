import type { Fase } from '../../core/engine/stepTypes'

const contatos = ['Ana (neta)', 'Bruno', 'Carlos', 'Dona Dulce', 'Edson', 'Filipa', 'Gustavo', 'Helena', 'Irene']

const lista = [
  { id: 'inicio', rotulo: 'Início da lista' },
  ...contatos.map((nome, i) => ({ id: `c${i + 1}`, rotulo: nome })),
  { id: 'fim', rotulo: 'Fim da lista' },
]

export const w0Deslizar: Fase = {
  id: 'w0-deslizar',
  mundo: 0,
  titulo: 'Deslizar a tela',
  simulador: 'celular',
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'A Ana salvou os contatos da vila no celular. Tem tanta gente que a lista não cabe na tela.' },
      { quem: 'neuza', texto: 'Deslize o dedo para ver todos, até o fim. Depois volte ao começo.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Viu quanta gente? Agora você tem a vila inteira no bolso.' }],
    premio: { emoji: '📒', titulo: 'Os contatos da vila' },
  },
  passos: [
    {
      id: 'deslizar-fim',
      instrucao: 'Deslize a lista para cima, com o dedo, até aparecer "Fim da lista".',
      tipo: 'deslizar',
      alvo: 'fim',
      elementos: lista,
      dicas: [
        'Encoste o dedo na lista e arraste para cima, sem soltar.',
        'Se preferir, use o botão "Descer" logo abaixo da lista.',
      ],
      erroGentil: 'Continue deslizando: ainda não chegou ao fim da lista.',
      lembrete: 'Para ver o que está mais embaixo, deslize o dedo para cima.',
    },
    {
      id: 'deslizar-inicio',
      instrucao: 'Agora deslize para baixo até voltar a ver "Início da lista".',
      tipo: 'deslizar',
      alvo: 'inicio',
      posicaoInicial: 'fim',
      elementos: lista,
      dicas: [
        'Desta vez arraste o dedo para baixo.',
        'Se preferir, use o botão "Subir" logo abaixo da lista.',
      ],
      erroGentil: 'Continue deslizando: ainda não voltou ao início da lista.',
      lembrete: 'Para voltar ao que ficou em cima, deslize o dedo para baixo.',
    },
  ],
}
