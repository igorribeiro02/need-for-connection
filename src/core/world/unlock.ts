// Quais fases estão abertas. Por decisão do projeto, TODAS ficam abertas desde o começo (sem restrições):
// cada pessoa escolhe por onde começar. Para voltar à regra antiga (a Fase 0 libera as outras), troque TUDO_ABERTO para false.
export const TUDO_ABERTO = true

import type { Mundo } from '../engine/stepTypes'

type ProgressoMinimo = Record<string, { status: string } | undefined>

export function resumoMundo(mundo: Mundo, fases: ProgressoMinimo): { concluidas: number; total: number } {
  const concluidas = mundo.fases.filter((f) => fases[f.id]?.status === 'concluida').length
  return { concluidas, total: mundo.fases.length }
}

export function mundoConcluido(mundo: Mundo, fases: ProgressoMinimo): boolean {
  const r = resumoMundo(mundo, fases)
  return r.total > 0 && r.concluidas === r.total
}

/** Mundos obrigatórios que ainda faltam terminar para abrir `numero`. */
export function pendenciasParaAbrir(numero: number, mundos: Mundo[], fases: ProgressoMinimo): Mundo[] {
  if (TUDO_ABERTO || numero === 0) return []
  return mundos.filter((m) => m.obrigatorio && m.numero !== numero && !mundoConcluido(m, fases))
}

export function mundoLiberado(numero: number, mundos: Mundo[], fases: ProgressoMinimo): boolean {
  return pendenciasParaAbrir(numero, mundos, fases).length === 0
}
