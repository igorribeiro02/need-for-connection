import type { Fase } from '../../core/engine/stepTypes'

const dicaMovimento = 'Use as setas na tela, as setas do teclado, ou toque no lugar para onde quer ir.'

export const w0Andar: Fase = {
  id: 'w0-andar',
  mundo: 0,
  titulo: 'Andar com o personagem',
  simulador: 'celular',
  mapa: {
    linhas: ['...T..p', '.T.T.T.', '.......', 'm.T.T.k', '...@...'],
    legenda: {
      m: { id: 'maca', rotulo: 'Maçã', emoji: '🍎' },
      k: { id: 'chave', rotulo: 'Chave', emoji: '🔑' },
      p: { id: 'porta', rotulo: 'Porta', emoji: '🚪' },
    },
  },
  passos: [
    {
      id: 'andar-maca',
      instrucao: 'Leve o personagem até a maçã 🍎 e toque em "Pegar".',
      tipo: 'andar',
      alvo: 'maca',
      acao: 'Pegar',
      dicas: [dicaMovimento, 'A maçã fica no canto de baixo, do lado esquerdo.'],
      erroGentil: 'Esse não é o objeto pedido. Procure a maçã 🍎.',
      lembrete: 'Para andar, use as setas ou toque no lugar. Ao chegar, toque no botão para confirmar.',
    },
    {
      id: 'andar-chave',
      instrucao: 'Agora leve o personagem até a chave 🔑 e toque em "Pegar".',
      tipo: 'andar',
      alvo: 'chave',
      acao: 'Pegar',
      dicas: ['A chave está do outro lado, no canto de baixo à direita.', 'Toque direto no desenho da chave: o personagem vai sozinho.'],
      erroGentil: 'Esse não é o objeto pedido. Procure a chave 🔑.',
      lembrete: 'Tocar direto no lugar faz o personagem ir sozinho até lá.',
    },
    {
      id: 'andar-porta',
      instrucao: 'Por fim, leve o personagem até a porta 🚪 e toque em "Abrir".',
      tipo: 'andar',
      alvo: 'porta',
      acao: 'Abrir',
      dicas: ['A porta fica no alto, no canto direito.', 'Árvores 🌳 bloqueiam o caminho: contorne por onde há chão livre.'],
      erroGentil: 'Esse não é o objeto pedido. Procure a porta 🚪, no alto.',
      lembrete: 'Obstáculos bloqueiam o caminho; procure por onde passar. Sem pressa.',
    },
  ],
}
