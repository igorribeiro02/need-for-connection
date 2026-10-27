import { describe, expect, it } from 'vitest'
import { mapaDosMundos, mundoEm } from '../src/content/worldMap'
import { mundos, todasAsFases } from '../src/content/worlds'
import { caminho, listarObjetos, objetoEm, posicaoInicial } from '../src/core/world/grid'
import { mundoConcluido, mundoLiberado, pendenciasParaAbrir } from '../src/core/world/unlock'

describe('contrato das fases (vale para qualquer fase nova do grupo)', () => {
  const fases = todasAsFases()

  it('ids de fases e de passos são únicos', () => {
    const ids = fases.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of fases) {
      const passos = f.passos.map((p) => p.id)
      expect(new Set(passos).size, f.id).toBe(passos.length)
    }
  })

  it('cada fase está no mundo certo e tem passos', () => {
    for (const m of mundos) for (const f of m.fases) {
      expect(f.mundo, f.id).toBe(m.numero)
      expect(f.passos.length, f.id).toBeGreaterThan(0)
    }
  })

  it('todo passo tem instrução, ao menos uma dica, erro gentil e lembrete', () => {
    for (const f of fases) for (const p of f.passos) {
      expect(p.instrucao.length, p.id).toBeGreaterThan(0)
      expect(p.dicas.length, p.id).toBeGreaterThan(0)
      expect(p.erroGentil.length, p.id).toBeGreaterThan(0)
      expect(p.lembrete.length, p.id).toBeGreaterThan(0)
    }
  })

  it('passos de tocar/escolher/julgar têm o alvo entre os botões', () => {
    for (const f of fases) for (const p of f.passos) {
      if (p.tipo === 'tocar' || p.tipo === 'escolher' || p.tipo === 'julgar') {
        expect(p.elementos?.some((e) => e.id === p.alvo), p.id).toBe(true)
      }
    }
  })

  it('passos de digitar têm resposta esperada', () => {
    for (const f of fases) for (const p of f.passos) {
      if (p.tipo === 'digitar') expect(p.esperado, p.id).toBeTruthy()
    }
  })

  it('passos de deslizar apontam para o início ou o fim de uma lista que os contém', () => {
    for (const f of fases) for (const p of f.passos) {
      if (p.tipo === 'deslizar') {
        expect(['inicio', 'fim'], p.id).toContain(p.alvo)
        expect(p.elementos?.some((e) => e.id === p.alvo), p.id).toBe(true)
      }
    }
  })

  it('passos de andar têm mapa e o objeto alvo existe e é alcançável', () => {
    for (const f of fases) for (const p of f.passos) {
      if (p.tipo !== 'andar') continue
      expect(f.mapa, p.id).toBeDefined()
      const mapa = f.mapa!
      const alvo = listarObjetos(mapa).find((o) => o.objeto.id === p.alvo)
      expect(alvo, p.id).toBeDefined()
      expect(caminho(mapa, posicaoInicial(mapa), alvo!.posicao).length, p.id).toBeGreaterThan(0)
    }
  })
})

describe('mapa dos mundos', () => {
  it('cada mundo tem uma entrada no mapa e ela é alcançável a partir da praça', () => {
    const inicio = posicaoInicial(mapaDosMundos)
    for (const m of mundos) {
      const entrada = listarObjetos(mapaDosMundos).find((o) => o.objeto.id === `mundo-${m.numero}`)
      expect(entrada, `Mundo ${m.numero}`).toBeDefined()
      expect(caminho(mapaDosMundos, inicio, entrada!.posicao).length).toBeGreaterThan(0)
      expect(mundoEm(entrada!.posicao)).toBe(m.numero)
      expect(objetoEm(mapaDosMundos, entrada!.posicao)?.rotulo).toContain(m.titulo)
    }
  })

  it('a praça não é a entrada de nenhum mundo', () => {
    expect(mundoEm(posicaoInicial(mapaDosMundos))).toBeUndefined()
  })
})

describe('liberação dos mundos', () => {
  const todasConcluidas = Object.fromEntries(
    mundos[0].fases.map((f) => [f.id, { status: 'concluida' }]),
  )

  it('o Mundo 0 está sempre aberto', () => {
    expect(mundoLiberado(0, mundos, {})).toBe(true)
  })

  it('os demais só abrem depois de concluir todo o Mundo 0', () => {
    expect(mundoLiberado(4, mundos, {})).toBe(false)
    expect(pendenciasParaAbrir(4, mundos, {}).map((m) => m.numero)).toEqual([0])

    const metade = { [mundos[0].fases[0].id]: { status: 'concluida' } }
    expect(mundoLiberado(4, mundos, metade)).toBe(false)

    expect(mundoConcluido(mundos[0], todasConcluidas)).toBe(true)
    expect(mundoLiberado(4, mundos, todasConcluidas)).toBe(true)
  })

  it('"em andamento" não conta como concluída', () => {
    const andamento = Object.fromEntries(mundos[0].fases.map((f) => [f.id, { status: 'em-andamento' }]))
    expect(mundoLiberado(1, mundos, andamento)).toBe(false)
  })
})
