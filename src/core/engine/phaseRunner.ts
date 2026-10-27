// Motor de fases: funções puras, sem React e sem acesso ao navegador.
// A interface chama estas funções e guarda o estado devolvido.

import type { Fase, Passo } from './stepTypes'

export type Aviso = { tipo: 'erro' | 'dica' | 'ok'; texto: string }

export type EstadoFase = {
  faseId: string
  indice: number // passo atual
  concluidos: string[] // ids dos passos já feitos
  dicasNoPasso: number // dicas já pedidas no passo atual
  dicasTotais: number // dicas pedidas na fase inteira
  erros: number
  concluida: boolean
  aviso?: Aviso
}

export type Estrelas = 1 | 2 | 3

/** Começa uma fase, ou retoma de onde parou (indice e concluidos vêm do progresso salvo). */
export function iniciar(fase: Fase, concluidos: string[] = [], dicasTotais = 0): EstadoFase {
  const validos = concluidos.filter((id) => fase.passos.some((p) => p.id === id))
  // retoma no primeiro passo ainda não concluído
  const indice = fase.passos.findIndex((p) => !validos.includes(p.id))
  return {
    faseId: fase.id,
    indice: indice === -1 ? fase.passos.length : indice,
    concluidos: validos,
    dicasNoPasso: 0,
    dicasTotais,
    erros: 0,
    concluida: indice === -1,
  }
}

export function passoAtual(fase: Fase, estado: EstadoFase): Passo | undefined {
  return fase.passos[estado.indice]
}

function normalizar(texto: string): string {
  return texto.trim().toLowerCase()
}

function confere(passo: Passo, resposta: string): boolean {
  if (passo.tipo === 'tocar' || passo.tipo === 'arrastar' || passo.tipo === 'andar') {
    return normalizar(resposta) === normalizar(passo.alvo)
  }
  const esperado = Array.isArray(passo.esperado) ? passo.esperado : [passo.esperado ?? '']
  return esperado.some((e) => normalizar(e) === normalizar(resposta))
}

/** Recebe a resposta da pessoa. Errar nunca tira nada: só mostra o erro gentil. */
export function responder(fase: Fase, estado: EstadoFase, resposta: string): EstadoFase {
  const passo = passoAtual(fase, estado)
  if (!passo || estado.concluida) return estado

  if (!confere(passo, resposta)) {
    return {
      ...estado,
      erros: estado.erros + 1,
      aviso: { tipo: 'erro', texto: passo.erroGentil },
    }
  }

  const concluidos = [...estado.concluidos, passo.id]
  const indice = estado.indice + 1
  const concluida = indice >= fase.passos.length
  return {
    ...estado,
    indice,
    concluidos,
    dicasNoPasso: 0,
    concluida,
    aviso: concluida ? { tipo: 'ok', texto: 'Muito bem! Você concluiu esta fase.' } : undefined,
  }
}

/** Pede uma dica. A 1ª é discreta; a última dica da lista mostra onde tocar. */
export function pedirDica(fase: Fase, estado: EstadoFase): EstadoFase {
  const passo = passoAtual(fase, estado)
  if (!passo || estado.concluida || passo.dicas.length === 0) return estado

  const proxima = Math.min(estado.dicasNoPasso + 1, passo.dicas.length)
  const ehNova = proxima > estado.dicasNoPasso
  return {
    ...estado,
    dicasNoPasso: proxima,
    dicasTotais: estado.dicasTotais + (ehNova ? 1 : 0),
    aviso: { tipo: 'dica', texto: passo.dicas[proxima - 1] },
  }
}

/** Estrelas medem quanto da fase foi feita sem ajuda: 0 dicas = 3, 1 dica = 2, 2 ou mais = 1. */
export function estrelas(estado: EstadoFase): Estrelas {
  if (estado.dicasTotais === 0) return 3
  if (estado.dicasTotais === 1) return 2
  return 1
}
