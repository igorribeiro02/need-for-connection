import type { Fase } from '../../core/engine/stepTypes'

export const w0Teclado: Fase = {
  id: 'w0-teclado',
  mundo: 0,
  titulo: 'Digitar no teclado',
  simulador: 'celular',
  passos: [
    {
      id: 'teclado-palavra',
      instrucao: 'Digite a palavra casa e toque em Pronto.',
      tipo: 'digitar',
      alvo: 'campo',
      esperado: 'casa',
      dicas: ['Toque na caixa branca para abrir o teclado.', 'Digite as letras: c, a, s, a.'],
      erroGentil: 'Quase! Confira se está escrito casa, com quatro letras.',
      lembrete: 'Toque na caixa para abrir o teclado e digite com calma, uma letra de cada vez.',
    },
    {
      id: 'teclado-numero',
      instrucao: 'Digite o número 123 e toque em Pronto.',
      tipo: 'digitar',
      alvo: 'campo',
      esperado: '123',
      teclado: 'numero',
      dicas: ['O teclado agora mostra números.', 'Toque em 1, depois 2, depois 3.'],
      erroGentil: 'Quase! Confira se está escrito 123.',
      lembrete: 'Quando a caixa pede número, o celular mostra um teclado só de números.',
    },
    {
      id: 'teclado-apagar',
      instrucao: 'A palavra está com uma letra a mais. Apague-a e toque em Pronto.',
      tipo: 'digitar',
      alvo: 'campo',
      esperado: 'casa',
      valorInicial: 'casaa',
      dicas: [
        'No teclado, a tecla com uma setinha ⌫ apaga a última letra.',
        'Apague só uma letra, a última, para ficar casa.',
      ],
      erroGentil: 'Quase! A palavra certa é casa. Use ⌫ para apagar a letra que sobra.',
      lembrete: 'A tecla com a setinha ⌫ apaga a última letra que você digitou. Errar é normal.',
    },
    {
      id: 'teclado-email',
      instrucao: 'Digite este e-mail de exemplo: ana@exemplo.com',
      tipo: 'digitar',
      alvo: 'campo',
      esperado: 'ana@exemplo.com',
      teclado: 'email',
      dicas: [
        'O sinal @ (arroba) aparece no teclado de letras ou na tela de símbolos.',
        'Escreva: ana, o sinal @, exemplo, um ponto e com. Tudo junto, sem espaços.',
      ],
      erroGentil: 'Quase! Escreva tudo junto, sem espaços: ana@exemplo.com',
      lembrete: 'Um e-mail tem um @ (arroba) no meio e um ponto antes do final, sem espaços.',
    },
  ],
}
