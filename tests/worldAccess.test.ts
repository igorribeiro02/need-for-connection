import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PainelMundo } from '../src/app/PainelMundo'
import { mundos } from '../src/content/worlds'
import { novosDados } from '../src/core/progress/schema'

describe('acesso livre às fases', () => {
  it.each(mundos)('mostra todas as fases do Mundo $numero para um jogador sem progresso', (mundo) => {
    const dados = novosDados({ id: 'teste', nome: 'Maria', avatar: '🙂' })
    const painel = document.createElement('div')
    painel.innerHTML = renderToStaticMarkup(createElement(PainelMundo, {
      mundo,
      dados,
      aoAbrirFase: () => {},
    }))

    const botoes = Array.from(painel.querySelectorAll('button'))
    expect(botoes.map((b) => b.textContent)).toEqual(mundo.fases.map((f) => f.titulo))
    expect(botoes.every((b) => !b.disabled)).toBe(true)
    expect(painel.textContent).not.toContain('bloqueado')
    expect(painel.textContent).not.toContain('Termine primeiro')
    if (mundo.fases.length === 0) expect(painel.textContent).toContain('Em breve')
  })
})
