// Mapas em grade: funções puras, sem React. Servem ao mapa dos mundos e aos
// passos 'andar' das fases. Um mapa é uma lista de linhas de texto:
//   '.'  chão livre      '@'  onde o personagem começa
//   'T'  obstáculo (árvore); outras letras/números são objetos da legenda.

export type Posicao = { x: number; y: number }
export type Direcao = 'cima' | 'baixo' | 'esquerda' | 'direita'

export type ObjetoMapa = { id: string; rotulo: string; emoji: string }

export type MapaDef = {
  linhas: string[]
  legenda: Record<string, ObjetoMapa>
  /** caractere -> emoji de algo em que não dá para pisar. Padrão: T = árvore. */
  obstaculos?: Record<string, string>
}

const OBSTACULOS_PADRAO: Record<string, string> = { T: '🌳' }

export function obstaculosDe(mapa: MapaDef): Record<string, string> {
  return mapa.obstaculos ?? OBSTACULOS_PADRAO
}

export const largura = (mapa: MapaDef): number => mapa.linhas[0]?.length ?? 0
export const altura = (mapa: MapaDef): number => mapa.linhas.length

export function dentro(mapa: MapaDef, p: Posicao): boolean {
  return p.x >= 0 && p.y >= 0 && p.y < altura(mapa) && p.x < largura(mapa)
}

export function celula(mapa: MapaDef, p: Posicao): string {
  return dentro(mapa, p) ? mapa.linhas[p.y][p.x] : ''
}

export function ehLivre(mapa: MapaDef, p: Posicao): boolean {
  return dentro(mapa, p) && !(celula(mapa, p) in obstaculosDe(mapa))
}

export function objetoEm(mapa: MapaDef, p: Posicao): ObjetoMapa | undefined {
  return mapa.legenda[celula(mapa, p)]
}

export function listarObjetos(mapa: MapaDef): { objeto: ObjetoMapa; posicao: Posicao }[] {
  const achados: { objeto: ObjetoMapa; posicao: Posicao }[] = []
  mapa.linhas.forEach((linha, y) =>
    [...linha].forEach((c, x) => {
      const objeto = mapa.legenda[c]
      if (objeto) achados.push({ objeto, posicao: { x, y } })
    }),
  )
  return achados
}

export function posicaoDoObjeto(mapa: MapaDef, id: string): Posicao | undefined {
  return listarObjetos(mapa).find((o) => o.objeto.id === id)?.posicao
}

/** Onde o personagem começa: a marca '@' ou, se não houver, a primeira casa livre. */
export function posicaoInicial(mapa: MapaDef): Posicao {
  for (let y = 0; y < altura(mapa); y++) {
    const x = mapa.linhas[y].indexOf('@')
    if (x !== -1) return { x, y }
  }
  for (let y = 0; y < altura(mapa); y++) {
    for (let x = 0; x < largura(mapa); x++) if (ehLivre(mapa, { x, y })) return { x, y }
  }
  return { x: 0, y: 0 }
}

const PASSO: Record<Direcao, Posicao> = {
  cima: { x: 0, y: -1 },
  baixo: { x: 0, y: 1 },
  esquerda: { x: -1, y: 0 },
  direita: { x: 1, y: 0 },
}

/** Um passo na direção pedida. Se bater na borda ou num obstáculo, fica onde está. */
export function mover(mapa: MapaDef, de: Posicao, direcao: Direcao): Posicao {
  const destino = { x: de.x + PASSO[direcao].x, y: de.y + PASSO[direcao].y }
  return ehLivre(mapa, destino) ? destino : de
}

const chave = (p: Posicao) => `${p.x},${p.y}`

/** Menor caminho (sem diagonais) até o destino, sem incluir a casa de partida. [] se não houver. */
export function caminho(mapa: MapaDef, de: Posicao, para: Posicao): Posicao[] {
  if (!ehLivre(mapa, para) || !ehLivre(mapa, de) || chave(de) === chave(para)) return []

  const veioDe = new Map<string, Posicao | null>([[chave(de), null]])
  const fila: Posicao[] = [de]
  while (fila.length > 0) {
    const atual = fila.shift() as Posicao
    if (chave(atual) === chave(para)) break
    for (const d of Object.keys(PASSO) as Direcao[]) {
      const prox = { x: atual.x + PASSO[d].x, y: atual.y + PASSO[d].y }
      if (ehLivre(mapa, prox) && !veioDe.has(chave(prox))) {
        veioDe.set(chave(prox), atual)
        fila.push(prox)
      }
    }
  }
  if (!veioDe.has(chave(para))) return []

  const rota: Posicao[] = []
  for (let p: Posicao | null = para; p && chave(p) !== chave(de); p = veioDe.get(chave(p)) ?? null) rota.unshift(p)
  return rota
}
