import { describe, expect, it } from 'vitest'
import {
  altura,
  caminho,
  ehLivre,
  largura,
  listarObjetos,
  mover,
  objetoEm,
  posicaoDoObjeto,
  posicaoInicial,
  type MapaDef,
} from '../src/core/world/grid'

const mapa: MapaDef = {
  linhas: ['@.T.', '.TT.', '...x'],
  legenda: { x: { id: 'alvo', rotulo: 'Alvo', emoji: '🎯' } },
}

describe('grade do mapa', () => {
  it('lê tamanho, início e objetos', () => {
    expect(largura(mapa)).toBe(4)
    expect(altura(mapa)).toBe(3)
    expect(posicaoInicial(mapa)).toEqual({ x: 0, y: 0 })
    expect(posicaoDoObjeto(mapa, 'alvo')).toEqual({ x: 3, y: 2 })
    expect(objetoEm(mapa, { x: 3, y: 2 })?.rotulo).toBe('Alvo')
    expect(listarObjetos(mapa)).toHaveLength(1)
  })

  it('árvores e bordas bloqueiam, objetos não', () => {
    expect(ehLivre(mapa, { x: 2, y: 0 })).toBe(false)
    expect(ehLivre(mapa, { x: -1, y: 0 })).toBe(false)
    expect(ehLivre(mapa, { x: 3, y: 2 })).toBe(true)
  })

  it('mover anda um passo, e fica parado se bater', () => {
    expect(mover(mapa, { x: 0, y: 0 }, 'direita')).toEqual({ x: 1, y: 0 })
    expect(mover(mapa, { x: 1, y: 0 }, 'direita')).toEqual({ x: 1, y: 0 }) // árvore
    expect(mover(mapa, { x: 0, y: 0 }, 'esquerda')).toEqual({ x: 0, y: 0 }) // borda
    expect(mover(mapa, { x: 0, y: 0 }, 'cima')).toEqual({ x: 0, y: 0 })
  })

  it('caminho contorna obstáculos pelo menor trajeto', () => {
    const rota = caminho(mapa, { x: 0, y: 0 }, { x: 3, y: 2 })
    expect(rota[rota.length - 1]).toEqual({ x: 3, y: 2 })
    expect(rota).toHaveLength(5) // desce, desce, direita x3
    expect(rota.every((p) => ehLivre(mapa, p))).toBe(true)
  })

  it('caminho devolve vazio se já está lá, se o destino é obstáculo ou se não há saída', () => {
    expect(caminho(mapa, { x: 0, y: 0 }, { x: 0, y: 0 })).toEqual([])
    expect(caminho(mapa, { x: 0, y: 0 }, { x: 2, y: 0 })).toEqual([])
    const isolado: MapaDef = { linhas: ['@T.'], legenda: {} }
    expect(caminho(isolado, { x: 0, y: 0 }, { x: 2, y: 0 })).toEqual([])
  })
})
