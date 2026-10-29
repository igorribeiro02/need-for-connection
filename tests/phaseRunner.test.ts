import { describe, expect, it } from 'vitest'
import { estrelas, iniciar, mostrarOnde, passoAtual, pedirDica, responder } from '../src/core/engine/phaseRunner'
import type { Fase } from '../src/core/engine/stepTypes'
import { w0Tocar } from '../src/content/phases/w0-tocar'

const fase: Fase = {
  id: 'teste',
  mundo: 0,
  titulo: 'Teste',
  simulador: 'celular',
  passos: [
    { id: 'a', instrucao: 'A', tipo: 'tocar', alvo: 'botao-a', dicas: ['d1', 'd2'], erroGentil: 'erro a', lembrete: 'la' },
    { id: 'b', instrucao: 'B', tipo: 'digitar', alvo: 'campo', esperado: ['Maria', 'maria silva'], dicas: ['d'], erroGentil: 'erro b', lembrete: 'lb' },
  ],
}

describe('phaseRunner', () => {
  it('começa no primeiro passo', () => {
    const e = iniciar(fase)
    expect(e.indice).toBe(0)
    expect(e.concluida).toBe(false)
    expect(passoAtual(fase, e)?.id).toBe('a')
  })

  it('errar não avança nem tira nada, e mostra o erro gentil', () => {
    const e = responder(fase, iniciar(fase), 'outro')
    expect(e.indice).toBe(0)
    expect(e.erros).toBe(1)
    expect(e.aviso).toEqual({ tipo: 'erro', texto: 'erro a' })
  })

  it('acertar avança e limpa o aviso', () => {
    let e = responder(fase, iniciar(fase), 'x')
    e = responder(fase, e, 'botao-a')
    expect(e.indice).toBe(1)
    expect(e.concluidos).toEqual(['a'])
    expect(e.aviso).toBeUndefined()
  })

  it('digitar ignora maiúsculas e espaços nas pontas', () => {
    let e = responder(fase, iniciar(fase), 'botao-a')
    e = responder(fase, e, '  MARIA SILVA ')
    expect(e.concluida).toBe(true)
  })

  it('não responde depois de concluída', () => {
    let e = responder(fase, iniciar(fase), 'botao-a')
    e = responder(fase, e, 'maria')
    const depois = responder(fase, e, 'qualquer')
    expect(depois).toBe(e)
  })

  it('dicas avançam até a última e contam uma vez cada', () => {
    let e = pedirDica(fase, iniciar(fase))
    expect(e.aviso?.texto).toBe('d1')
    e = pedirDica(fase, e)
    expect(e.aviso?.texto).toBe('d2')
    e = pedirDica(fase, e) // já é a última: repete, sem contar de novo
    expect(e.aviso?.texto).toBe('d2')
    expect(e.dicasTotais).toBe(2)
  })

  it('estrelas dependem das dicas, não dos erros', () => {
    let e = iniciar(fase)
    e = responder(fase, e, 'errado')
    e = responder(fase, e, 'errado')
    expect(estrelas(e)).toBe(3)
    e = pedirDica(fase, e)
    expect(estrelas(e)).toBe(2)
    e = pedirDica(fase, e)
    expect(estrelas(e)).toBe(1)
  })

  it('retoma do primeiro passo ainda não concluído', () => {
    const e = iniciar(fase, ['a'])
    expect(e.indice).toBe(1)
    expect(e.concluida).toBe(false)
  })

  it('retomar mantém as dicas já usadas, então a nota não zera', () => {
    const e = iniciar(fase, ['a'], 2)
    expect(e.dicasTotais).toBe(2)
    expect(estrelas(e)).toBe(1)
  })

  it('ignora ids de passos que não existem mais na fase', () => {
    const e = iniciar(fase, ['a', 'antigo'])
    expect(e.concluidos).toEqual(['a'])
  })

  it('fase com todos os passos feitos já começa concluída', () => {
    expect(iniciar(fase, ['a', 'b']).concluida).toBe(true)
  })

  it('a fase de exemplo do Mundo 0 é concluível seguindo os alvos', () => {
    let e = iniciar(w0Tocar)
    for (const p of w0Tocar.passos) e = responder(w0Tocar, e, p.alvo)
    expect(e.concluida).toBe(true)
    expect(estrelas(e)).toBe(3)
  })

  it('todo alvo de tocar existe entre os elementos do passo', () => {
    for (const p of w0Tocar.passos) {
      if (p.tipo === 'tocar') expect(p.elementos?.some((el) => el.id === p.alvo)).toBe(true)
    }
  })

  it('deslizar e andar comparam a resposta com o alvo, como tocar', () => {
    const f: Fase = {
      id: 'x',
      mundo: 0,
      titulo: 'X',
      simulador: 'celular',
      passos: [
        { id: 'd', instrucao: 'D', tipo: 'deslizar', alvo: 'fim', dicas: ['d'], erroGentil: 'ed', lembrete: 'ld' },
        { id: 'w', instrucao: 'W', tipo: 'andar', alvo: 'maca', dicas: ['d'], erroGentil: 'ew', lembrete: 'lw' },
      ],
    }
    let e = iniciar(f)
    e = responder(f, e, 'inicio')
    expect(e.indice).toBe(0)
    e = responder(f, e, 'fim')
    expect(e.indice).toBe(1)
    e = responder(f, e, 'chave')
    expect(e.aviso?.texto).toBe('ew')
    e = responder(f, e, 'maca')
    expect(e.concluida).toBe(true)
  })

  it('conta erros seguidos no passo e zera ao acertar', () => {
    let e = iniciar(fase)
    e = responder(fase, e, 'x')
    e = responder(fase, e, 'y')
    expect(e.errosNoPasso).toBe(2)
    expect(e.erros).toBe(2)
    e = responder(fase, e, 'botao-a')
    expect(e.errosNoPasso).toBe(0)
    expect(e.erros).toBe(2)
  })

  it('"me mostre" vai direto à última dica e conta uma dica só', () => {
    let e = mostrarOnde(fase, iniciar(fase))
    expect(e.dicasNoPasso).toBe(2)
    expect(e.dicasTotais).toBe(1)
    expect(e.aviso?.texto).toBe('d2')
    e = mostrarOnde(fase, e) // já estava lá: não conta de novo
    expect(e.dicasTotais).toBe(1)
    expect(estrelas(e)).toBe(2)
  })

  it('"me mostre" depois de uma dica soma só mais uma', () => {
    const e = mostrarOnde(fase, pedirDica(fase, iniciar(fase)))
    expect(e.dicasTotais).toBe(2)
  })
})
