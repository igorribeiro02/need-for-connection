import { describe, expect, it } from 'vitest'
import { mundos } from '../src/content/worlds'
import { novosDados, migrar } from '../src/core/progress/schema'
import { exportarCodigo, importarCodigo } from '../src/core/progress/backupCode'
import { finalPendente, idFinal, marcarCena, montarAlbum, textoDaFala } from '../src/core/story/historia'

const mundo0 = mundos.find((m) => m.numero === 0)!
const concluidas = Object.fromEntries(mundo0.fases.map((f) => [f.id, { status: 'concluida' }]))

describe('história', () => {
  it('troca {nome} pelo primeiro nome', () => {
    expect(textoDaFala('Oi, {nome}!', 'Maria da Silva')).toBe('Oi, Maria!')
    expect(textoDaFala('Oi, {nome}!', 'Dona Maria da Silva')).toBe('Oi, Maria!')
    expect(textoDaFala('Oi, {nome}!', 'Seu')).toBe('Oi, Seu!')
    expect(textoDaFala('Oi, {nome}!', '  ')).toBe('Oi, amigo!')
  })

  it('a cena final do mundo só fica pendente quando todas as fases acabaram e ela ainda não foi vista', () => {
    expect(finalPendente(mundo0, { fases: {}, cenasVistas: [] })).toBe(false)
    expect(finalPendente(mundo0, { fases: concluidas, cenasVistas: [] })).toBe(true)
    expect(finalPendente(mundo0, { fases: concluidas, cenasVistas: [idFinal(0)] })).toBe(false)
  })

  it('o álbum mostra o prêmio de fases concluídas e a silhueta das que faltam', () => {
    const [primeira, ...resto] = mundo0.fases
    const album = montarAlbum(mundos, { [primeira.id]: { status: 'concluida' } }, [])
    const pg = album.find((p) => p.mundo === 0)!
    expect(pg.itens.find((i) => i.id === primeira.id)?.ganho).toBe(true)
    for (const f of resto) expect(pg.itens.find((i) => i.id === f.id)?.ganho).toBe(false)
    expect(pg.itens.find((i) => i.id === idFinal(0))?.ganho).toBe(false)
  })

  it('marcar uma cena duas vezes não repete', () => {
    expect(marcarCena(marcarCena([], 'a'), 'a')).toEqual(['a'])
  })

  it('as cenas vistas sobrevivem ao backup e backups antigos continuam valendo', () => {
    const d = {
      ...novosDados({ id: 'x', nome: 'Ana', avatar: '🙂' }),
      cenasVistas: ['abertura:w0-tocar'],
    }
    const volta = importarCodigo(exportarCodigo(d))
    expect(volta.ok && volta.dados.cenasVistas).toEqual(['abertura:w0-tocar'])
    const { cenasVistas: _antigo, ...semCampo } = d
    expect(migrar(semCampo)?.cenasVistas).toEqual([])
  })
})
