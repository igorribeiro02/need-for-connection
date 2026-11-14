// Regras puras da história (sem React): textos, cenas vistas e o álbum de prêmios.

import type { Mundo, Premio } from '../engine/stepTypes'

export type ProgressoHistoria = {
  fases: Record<string, { status: string } | undefined>
  cenasVistas: string[]
}

/** Troca {nome} pelo primeiro nome de quem joga. */
export function textoDaFala(texto: string, nomeCompleto: string): string {
  // "Dona Maria da Silva" -> "Maria": pula o tratamento no começo
  const partes = nomeCompleto.trim().split(/\s+/).filter(Boolean)
  const semTitulo = partes.length > 1 && /^(dona|seu|sr\.?|sra\.?|dr\.?|dra\.?)$/i.test(partes[0]) ? partes.slice(1) : partes
  const primeiro = semTitulo[0] || 'amigo'
  return texto.replace(/\{nome\}/g, primeiro)
}

export const idAbertura = (faseId: string) => `abertura:${faseId}`
export const idFechamento = (faseId: string) => `fechamento:${faseId}`
export const idFinal = (mundo: number) => `final:${mundo}`

export function cenaVista(d: Pick<ProgressoHistoria, 'cenasVistas'>, id: string): boolean {
  return d.cenasVistas.includes(id)
}

export function marcarCena(vistas: string[], id: string): string[] {
  return vistas.includes(id) ? vistas : [...vistas, id]
}

/** Quando todas as fases do mundo estão concluídas (e há história final) mas a cena ainda não foi vista. */
export function finalPendente(mundo: Mundo, d: ProgressoHistoria): boolean {
  if (!mundo.historiaFinal || mundo.fases.length === 0) return false
  const completo = mundo.fases.every((f) => d.fases[f.id]?.status === 'concluida')
  return completo && !cenaVista(d, idFinal(mundo.numero))
}

export type PaginaAlbum = {
  mundo: number
  tituloMundo: string
  dia?: string
  itens: { id: string; premio: Premio; ganho: boolean; faseTitulo?: string }[]
}

/** O álbum: uma página por mundo que tem história, com os prêmios ganhos e as silhuetas dos que faltam. */
export function montarAlbum(mundos: Mundo[], fases: ProgressoHistoria['fases'], cenasVistas: string[]): PaginaAlbum[] {
  const paginas: PaginaAlbum[] = []
  for (const m of mundos) {
    const itens: PaginaAlbum['itens'] = []
    for (const f of m.fases) {
      if (!f.historia) continue
      itens.push({
        id: f.id,
        premio: f.historia.premio,
        ganho: fases[f.id]?.status === 'concluida',
        faseTitulo: f.titulo,
      })
    }
    if (m.historiaFinal) {
      itens.push({
        id: idFinal(m.numero),
        premio: m.historiaFinal.premio,
        ganho: cenasVistas.includes(idFinal(m.numero)),
      })
    }
    if (itens.length > 0)
      paginas.push({
        mundo: m.numero,
        tituloMundo: m.titulo,
        dia: m.dia,
        itens,
      })
  }
  return paginas
}
