import type { MapaDef, Posicao } from '../core/world/grid'
import { objetoEm } from '../core/world/grid'
import { mundos } from './worlds'

// O "vilarejo": cada número é a entrada do mundo correspondente; T é árvore.
const EMOJI: Record<number, string> = { 0: '👆', 1: '📱', 2: '💬', 3: '🖼️', 4: '🏦', 5: '🛡️', 6: '🛒' }

export const mapaDosMundos: MapaDef = {
  linhas: ['T.1...2.T', '...T.T...', '3.......4', '.T..@..T.', '.........', '5.T...T.6', 'T...0...T'],
  legenda: Object.fromEntries(
    mundos.map((m) => [
      String(m.numero),
      { id: `mundo-${m.numero}`, rotulo: `Mundo ${m.numero}: ${m.titulo}`, emoji: EMOJI[m.numero] ?? '⭐' },
    ]),
  ),
}

/** Número do mundo cuja entrada está nesta casa (ou undefined se for chão comum). */
export function mundoEm(p: Posicao): number | undefined {
  const objeto = objetoEm(mapaDosMundos, p)
  return objeto ? Number(objeto.id.replace('mundo-', '')) : undefined
}
