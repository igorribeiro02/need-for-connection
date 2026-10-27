import type { Fase } from '../../core/engine/stepTypes'

export const w0Tocar: Fase = {
  id: 'w0-tocar',
  mundo: 0,
  titulo: 'Tocar na tela',
  simulador: 'celular',
  passos: [
    {
      id: 'tocar-comecar',
      instrucao: 'Toque no botão Começar.',
      tipo: 'tocar',
      alvo: 'comecar',
      elementos: [{ id: 'comecar', rotulo: 'Começar' }],
      dicas: ['O botão está no meio da tela.', 'Toque no botão azul escrito Começar.'],
      erroGentil: 'Quase! Toque no botão escrito Começar.',
      lembrete: 'Para usar um botão, toque nele uma vez com a ponta do dedo.',
    },
    {
      id: 'tocar-escolher',
      instrucao: 'Toque no botão Verde.',
      tipo: 'tocar',
      alvo: 'verde',
      elementos: [
        { id: 'vermelho', rotulo: 'Vermelho' },
        { id: 'verde', rotulo: 'Verde' },
        { id: 'azul', rotulo: 'Azul' },
      ],
      dicas: ['Leia o que está escrito em cada botão.', 'É o botão do meio.'],
      erroGentil: 'Sem problema! Leia o nome de cada botão e toque em Verde.',
      lembrete: 'Leia o nome do botão antes de tocar. Se errar, é só tentar de novo.',
    },
    {
      id: 'tocar-confirmar',
      instrucao: 'Toque em Confirmar para terminar.',
      tipo: 'tocar',
      alvo: 'confirmar',
      elementos: [
        { id: 'cancelar', rotulo: 'Cancelar' },
        { id: 'confirmar', rotulo: 'Confirmar' },
      ],
      dicas: ['Confirmar significa dizer que sim.', 'É o segundo botão.'],
      erroGentil: 'Quase! Cancelar desfaz. Para terminar, toque em Confirmar.',
      lembrete: 'Confirmar diz que sim; Cancelar desfaz. Sempre leia antes de tocar.',
    },
  ],
}
