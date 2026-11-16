// Resumos do progresso dos mundos. Todos podem ser acessados livremente.

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
