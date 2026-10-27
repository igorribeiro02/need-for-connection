import { useCallback, useEffect, useRef } from 'react'
import { caminho, mover as moverNoMapa, type Direcao, type MapaDef, type Posicao } from '../core/world/grid'

const MS_POR_PASSO = 150

function prefereMenosMovimento(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Move o personagem por setas/botões (um passo) ou por toque (anda o caminho todo, passo a passo). */
export function useMovimento(mapa: MapaDef, posicao: Posicao, definirPosicao: (p: Posicao) => void) {
  const atual = useRef(posicao)
  const relogio = useRef<number | undefined>(undefined)

  useEffect(() => {
    atual.current = posicao
  }, [posicao])

  const parar = useCallback(() => {
    if (relogio.current !== undefined) window.clearTimeout(relogio.current)
    relogio.current = undefined
  }, [])

  // ao sair da tela, cancela a caminhada
  useEffect(() => parar, [parar])

  const ir = useCallback(
    (p: Posicao) => {
      atual.current = p
      definirPosicao(p)
    },
    [definirPosicao],
  )

  const mover = useCallback(
    (direcao: Direcao) => {
      parar()
      ir(moverNoMapa(mapa, atual.current, direcao))
    },
    [mapa, parar, ir],
  )

  const irPara = useCallback(
    (destino: Posicao) => {
      parar()
      const rota = caminho(mapa, atual.current, destino)
      if (rota.length === 0) return
      if (prefereMenosMovimento()) {
        ir(rota[rota.length - 1])
        return
      }
      let i = 0
      const andar = () => {
        ir(rota[i])
        i += 1
        if (i < rota.length) relogio.current = window.setTimeout(andar, MS_POR_PASSO)
      }
      andar()
    },
    [mapa, parar, ir],
  )

  return { mover, irPara, parar }
}
