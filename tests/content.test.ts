import { describe, expect, it } from 'vitest'
import { mapaDosMundos, mundoEm } from '../src/content/worldMap'
import { bancos } from '../src/content/banks'
import { mundos, todasAsFases, todasAsFasesResolvidas } from '../src/content/worlds'
import { caminho, listarObjetos, objetoEm, posicaoInicial } from '../src/core/world/grid'
import { mundoConcluido, mundoLiberado, pendenciasParaAbrir } from '../src/core/world/unlock'

describe('contrato das fases (vale para qualquer fase nova do grupo)', () => {
  const fases = todasAsFasesResolvidas().map((r) => r.fase) // fases de banco aparecem uma vez por banco

  it('ids de fases e de passos são únicos', () => {
    const ids = todasAsFases().map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of fases) {
      const passos = f.passos.map((p) => p.id)
      expect(new Set(passos).size, f.id).toBe(passos.length)
    }
  })

  it('cada fase está no mundo certo e tem passos', () => {
    for (const m of mundos) for (const f of m.fases) {
      expect(f.mundo, f.id).toBe(m.numero)
    }
    for (const f of fases) expect(f.passos.length, f.id).toBeGreaterThan(0)
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

function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

describe('bancos e fases de Pix', () => {
  it('todo banco tem texto branco legível sobre a cor principal (contraste >= 4,5)', () => {
    for (const b of bancos) {
      const contraste = 1.05 / (luminancia(b.tema.corPrincipal) + 0.05)
      expect(contraste, b.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('a tela inicial de cada banco tem o atalho do Pix e os passos de início usam o layout de início', () => {
    const fase = mundos[4].fases[0]
    for (const b of bancos) {
      expect(b.inicio.atalhos.some((a) => a.rotulo === b.fluxo.entradaPix), b.id).toBe(true)
      const passos = fase.gerarPassos!(b)
      for (const id of ['saldo', 'ir-pix']) {
        const p = passos.find((x) => x.id === id)!
        expect(['inicio', 'app'], `${b.id}/${id}`).toContain(p.tela?.layout)
        expect(p.elementos!.some((e) => e.id === p.alvo), `${b.id}/${id}`).toBe(true)
      }
    }
  })

  it('todo banco diz de onde veio o fluxo e tem o atalho do Pix', () => {
    for (const b of bancos) {
      expect(b.fonte.length, b.id).toBeGreaterThan(0)
      expect(b.fluxo.entradaPix.length, b.id).toBeGreaterThan(0)
      expect(b.fluxo.caminho.length + (b.fluxo.menuPix || b.telas ? 1 : 0), b.id).toBeGreaterThan(0)
    }
  })

  const idsDe = (id: string, variante: 'normal' | 'nome-diferente' = 'normal') => {
    const fase = mundos[4].fases[variante === 'normal' ? 0 : 1]
    return fase.gerarPassos!(bancos.find((b) => b.id === id)!).map((p) => p.id)
  }

  it('os fluxos seguem o que as fontes descrevem (ordem das telas)', () => {
    // Nubank: valor antes da chave
    const nu = idsDe('nubank')
    expect(nu.indexOf('valor')).toBeLessThan(nu.indexOf('tipo-chave'))
    // Caixa: chave e depois valor
    const cx = idsDe('caixa')
    expect(cx.indexOf('tipo-chave')).toBeLessThan(cx.indexOf('valor'))
    // Itaú (capturas reais): o nome aparece com o valor; escolhe-se o valor e só depois a conta de onde sai
    const it = idsDe('itau')
    expect(it.slice(it.indexOf('caminho-1'))).toEqual(expect.arrayContaining(['chave', 'revisar', 'valor', 'conta']))
    expect(it.indexOf('revisar')).toBeLessThan(it.indexOf('valor'))
    expect(it.indexOf('valor')).toBeLessThan(it.indexOf('conta'))
    expect(it).not.toContain('tipo-chave')
    // Bradesco: a chave é digitada na própria tela do Pix (sem escolher o tipo); valor, depois a conta; o nome só no fim
    const br = idsDe('bradesco')
    expect(br).not.toContain('tipo-chave')
    expect(br.some((id) => id.startsWith('caminho-'))).toBe(false)
    expect(br.indexOf('ir-pix') + 1).toBe(br.indexOf('chave'))
    expect(br.indexOf('valor')).toBeLessThan(br.indexOf('conta'))
    expect(br.indexOf('revisar')).toBeGreaterThan(br.indexOf('conta'))
    // BB: tem data
    expect(idsDe('banco-do-brasil')).toContain('data')
    expect(idsDe('nubank')).not.toContain('data')
  })

  it('telas copiadas de apps reais: o botão certo existe uma vez e nenhum enfeite vale como resposta', () => {
    for (const b of bancos.filter((x) => x.telas)) {
      for (const variante of [0, 1]) {
        const passos = mundos[4].fases[variante].gerarPassos!(b)
        for (const p of passos.filter((x) => x.tela?.layout === 'app' && x.tipo === 'tocar')) {
          const ids = p.elementos!.map((e) => e.id)
          expect(ids.filter((id) => id === p.alvo).length, `${b.id}/${p.id}`).toBe(1)
        }
      }
    }
  })

  it('Inter: caminho Pix > Pagar > chave > valor > revisão > iSafe, com o nome do destinatário na tela do valor', () => {
    const inter = bancos.find((b) => b.id === 'inter')!
    const ids = mundos[4].fases[0].gerarPassos!(inter).map((p) => p.id)
    expect(ids).toEqual(['entrar', 'saldo', 'ir-pix', 'caminho-1', 'chave', 'valor', 'revisar', 'confirmar', 'autenticar', 'comprovante'])
    const valor = mundos[4].fases[1].gerarPassos!(inter).find((p) => p.id === 'valor')!
    const campo = valor.tela!.app!.blocos.find((x) => x.tipo === 'campo')!
    expect(campo.tipo === 'campo' && campo.entre).toContain('Carlos Alberto Lima')
  })

  it('PicPay e Mercado Pago: a chave é digitada na tela copiada, sem escolher o tipo de chave', () => {
    for (const id of ['picpay', 'mercado-pago']) {
      const ids = idsDe(id)
      expect(ids, id).not.toContain('tipo-chave')
      expect(ids.indexOf('ir-pix') + (id === 'picpay' ? 2 : 1), id).toBe(ids.indexOf('chave'))
    }
  })

  it('a quantidade de passos muda por banco', () => {
    const tamanhos = new Set(bancos.map((b) => idsDe(b.id).length))
    expect(tamanhos.size).toBeGreaterThan(2)
  })

  it('a senha tem o tamanho certo para cada banco (BB: 6 números)', () => {
    const fase = mundos[4].fases[0]
    for (const b of bancos) {
      const passos = fase.gerarPassos!(b)
      if (b.fluxo.confirmacao.digitos === 0) {
        // Inter: só toca em CONFIRMAR (iSafe), sem digitar senha
        expect(passos.some((p) => p.id === 'senha'), b.id).toBe(false)
        expect(passos.some((p) => p.id === 'autenticar'), b.id).toBe(true)
        continue
      }
      const senha = passos.find((p) => p.id === 'senha')!
      expect(String(senha.esperado).length, b.id).toBe(b.fluxo.confirmacao.digitos)
    }
    expect(bancos.find((b) => b.id === 'banco-do-brasil')!.fluxo.confirmacao.digitos).toBe(6)
  })

  it('na variante do nome diferente o aluno para na conferência e cancela', () => {
    for (const b of bancos) {
      const ids = idsDe(b.id, 'nome-diferente')
      expect(ids[ids.length - 1], b.id).toBe('cancelar')
      expect(ids[ids.length - 2], b.id).toBe('revisar')
      expect(ids).not.toContain('senha')
    }
  })

  it('o jogador consegue concluir cada fase de Pix em cada banco só com as respostas certas', async () => {
    const { iniciar, passoAtual, responder } = await import('../src/core/engine/phaseRunner')
    for (const { fase, banco } of todasAsFasesResolvidas()) {
      if (!banco) continue
      let e = iniciar(fase)
      let guarda = 0
      while (!e.concluida && guarda++ < 50) {
        const p = passoAtual(fase, e)!
        const resposta = p.tipo === 'digitar' ? (Array.isArray(p.esperado) ? p.esperado[0] : p.esperado!) : p.alvo
        e = responder(fase, e, resposta)
      }
      expect(e.concluida, `${fase.id} em ${banco.id}`).toBe(true)
      expect(e.erros, `${fase.id} em ${banco.id}`).toBe(0)
    }
  })

  it('nos passos de tocar de banco, o botão certo muda de posição entre os bancos', () => {
    const pix = mundos[4].fases[0]
    const posicoes = new Set(
      bancos.map((b) => {
        const passo = pix.gerarPassos!(b).find((p) => p.id === 'comprovante')!
        return passo.elementos!.findIndex((e) => e.id === passo.alvo)
      }),
    )
    expect(posicoes.size).toBeGreaterThan(1)
  })
})

describe('transporte por aplicativo (Uber e 99)', () => {
  const mundo = mundos.find((m) => m.numero === 7)!
  const fase = (id: string) => mundo.fases.find((f) => f.id === id)!

  it('o Mundo 7 existe, tem as três fases e cada fase diz de qual app são as telas', () => {
    expect(mundo.titulo).toContain('Transporte')
    expect(mundo.fases.map((f) => f.id)).toEqual(['w7-uber-pedir', 'w7-99-pedir', 'w7-conferir-motorista'])
    for (const f of mundo.fases) {
      expect(f.simulador, f.id).toBe('transporte')
      expect(f.aplicativo?.fonte.length, f.id).toBeGreaterThan(0)
    }
  })

  it('todos os passos usam telas de app e o botão certo aparece uma única vez', () => {
    for (const f of mundo.fases) for (const p of f.passos) {
      expect(p.tela?.layout, p.id).toBe('app')
      if (p.tipo === 'tocar') expect(p.elementos!.filter((e) => e.id === p.alvo), `${f.id}/${p.id}`).toHaveLength(1)
    }
  })

  it('o pedido no Uber segue a ordem: Para onde? > destino > carro > Confirmar > partida', () => {
    expect(fase('w7-uber-pedir').passos.map((p) => p.id)).toEqual(['inicio', 'destino', 'categoria', 'confirmar-uber', 'partida'])
    expect(fase('w7-uber-pedir').passos[0].alvo).toBe('para-onde')
  })

  it('o pedido na 99 usa os nomes dos botões da central de ajuda', () => {
    const f = fase('w7-99-pedir')
    expect(f.passos.map((p) => p.alvo)).toEqual(['para-onde', 'campo', 'pop', 'confirmar', 'tudo-certo'])
    expect(f.passos[f.passos.length - 1].dicas.join(' ')).toContain('Tudo certo, pode chamar!')
  })

  it('na conferência, a placa do primeiro carro é diferente da do app e a resposta certa é "não"', () => {
    const [errada, certa] = fase('w7-conferir-motorista').passos
    expect(errada.alvo).toBe('nao')
    expect(errada.instrucao).toContain('XYZ-9K87')
    expect(errada.instrucao).not.toContain('ABC-1D23')
    expect(certa.alvo).toBe('sim')
  })

  it('as fases se completam só com as respostas certas, sem erros', async () => {
    const { iniciar, passoAtual, responder } = await import('../src/core/engine/phaseRunner')
    for (const f of mundo.fases) {
      let e = iniciar(f)
      let guarda = 0
      while (!e.concluida && guarda++ < 20) {
        const p = passoAtual(f, e)!
        e = responder(f, e, p.esperado ? (Array.isArray(p.esperado) ? p.esperado[0] : p.esperado) : p.alvo)
      }
      expect(e.concluida, f.id).toBe(true)
      expect(e.erros, f.id).toBe(0)
    }
  })

  it('o mundo abre depois do Mundo 0', () => {
    expect(mundoLiberado(7, mundos, {})).toBe(false)
    const m0 = Object.fromEntries(mundos[0].fases.map((f) => [f.id, { status: 'concluida' }]))
    expect(mundoLiberado(7, mundos, m0)).toBe(true)
  })
})
