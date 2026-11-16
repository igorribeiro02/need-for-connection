import { describe, expect, it } from 'vitest'
import { todasAsFasesResolvidas } from '../src/content/worlds'
import { estrelas, iniciar, responder } from '../src/core/engine/phaseRunner'
import { idDoItem, itensDoBloco } from '../src/core/engine/telaApp'

// Joga cada fase até o fim com as respostas certas e confere que: o alvo existe na tela, errar não avança e acertar tudo dá 3 estrelas.
describe('todas as fases podem ser terminadas, passo a passo', () => {
  for (const { fase, banco } of todasAsFasesResolvidas()) {
    it(`${fase.id}${banco ? ` (${banco.id})` : ''}`, () => {
      let estado = iniciar(fase)
      for (const passo of fase.passos) {
        if (passo.tipo === 'tocar' && passo.tela?.app) {
          const ids = passo.tela.app.blocos.flatMap(itensDoBloco).filter((i) => !i.inerte).map(idDoItem)
          expect(ids.filter((id) => id === passo.alvo).length, `${passo.id}: o alvo aparece uma vez na tela`).toBe(1)
        }
        const resposta = passo.tipo === 'digitar' ? String(Array.isArray(passo.esperado) ? passo.esperado[0] : passo.esperado) : passo.alvo
        if (passo.tipo !== 'andar' && passo.tipo !== 'deslizar') {
          const errado = responder(fase, estado, passo.livre ? '   ' : '__resposta-errada__')
          expect(errado.indice, `${passo.id}: errar não avança`).toBe(estado.indice)
        }
        estado = responder(fase, estado, resposta)
      }
      expect(estado.indice).toBeGreaterThanOrEqual(fase.passos.length)
      expect(estrelas(estado)).toBe(3)
    })
  }
})
