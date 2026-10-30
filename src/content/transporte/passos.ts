import { elementosDaTela } from '../../core/engine/telaApp'
import type { Passo, TelaApp } from '../../core/engine/stepTypes'

/** Passo de tocar em um botão de uma tela de app de transporte. */
export function toque(
  id: string,
  instrucao: string,
  app: TelaApp,
  alvo: string,
  rotuloAlvo: string,
  lembrete: string,
  ondeEsta: string,
): Passo {
  return {
    id,
    instrucao,
    tipo: 'tocar',
    alvo,
    tela: { titulo: '', layout: 'app', app },
    elementos: elementosDaTela(app),
    dicas: [`Procure o botão "${rotuloAlvo}".`, ondeEsta],
    erroGentil: `Quase! Procure o botão escrito "${rotuloAlvo}".`,
    lembrete,
  }
}

/** Passo de escrever, na caixa da tela do app. */
export function digitar(
  id: string,
  instrucao: string,
  app: TelaApp,
  esperado: string,
  rotuloCampo: string,
  rotuloBotao: string,
  lembrete: string,
): Passo {
  return {
    id,
    instrucao,
    tipo: 'digitar',
    alvo: 'campo',
    esperado,
    teclado: 'texto',
    rotuloCampo,
    rotuloBotao,
    tela: { titulo: '', layout: 'app', app },
    dicas: [`Toque na caixa "${rotuloCampo}" e escreva o nome do lugar.`, `Escreva: ${esperado}`],
    erroGentil: `Quase! Confira se está escrito ${esperado}.`,
    lembrete,
  }
}

/** Pergunta do exercício: a tela do app aparece inteira e as respostas ficam num painel à parte. */
export function pergunta(
  id: string,
  instrucao: string,
  app: TelaApp,
  opcoes: { id: string; rotulo: string }[],
  alvo: string,
  dicas: string[],
  erroGentil: string,
  lembrete: string,
): Passo {
  return {
    id,
    instrucao,
    tipo: 'escolher',
    alvo,
    esperado: alvo,
    tela: { titulo: '', layout: 'app', app },
    painelExercicio: true,
    elementos: opcoes,
    dicas,
    erroGentil,
    lembrete,
  }
}
