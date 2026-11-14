import type { CSSProperties } from 'react'
import { personagens } from '../../content/story/personagens'
import type { PersonagemId } from '../../core/engine/stepTypes'

/** Cores do personagem como variáveis CSS (usadas pelo balão, pela faixa e pelo rosto). */
export function estiloPersonagem(quem: PersonagemId): CSSProperties {
  const p = personagens[quem]
  return { ['--fundo-personagem' as string]: p.fundo, ['--borda-personagem' as string]: p.borda }
}
