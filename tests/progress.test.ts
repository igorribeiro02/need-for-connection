import { beforeEach, describe, expect, it } from 'vitest'
import { exportarCodigo, importarCodigo } from '../src/core/progress/backupCode'
import { conferePin, hashPin, pinValido } from '../src/core/progress/pin'
import { migrar, novosDados, VERSAO_ATUAL } from '../src/core/progress/schema'
import {
  carregarPerfil,
  criarPerfil,
  definirPerfilAtivo,
  listarPerfis,
  perfilAtivoId,
  removerPerfil,
  salvarPerfil,
} from '../src/core/progress/storage'

const perfil = { id: 'p1', nome: 'Maria José', avatar: '👵' }

beforeEach(() => localStorage.clear())

describe('storage', () => {
  it('cria, lista e carrega perfis', () => {
    criarPerfil(perfil)
    criarPerfil({ id: 'p2', nome: 'João', avatar: '🙂' })
    expect(listarPerfis().map((p) => p.nome)).toEqual(['Maria José', 'João'])
    expect(carregarPerfil('p1')?.perfil.nome).toBe('Maria José')
  })

  it('salva progresso e lembra o perfil ativo', () => {
    const d = criarPerfil(perfil)
    d.fases['w0-tocar'] = { status: 'em-andamento', estrelas: 0, passosConcluidos: ['tocar-comecar'] }
    salvarPerfil(d)
    definirPerfilAtivo('p1')
    expect(perfilAtivoId()).toBe('p1')
    expect(carregarPerfil('p1')?.fases['w0-tocar'].passosConcluidos).toEqual(['tocar-comecar'])
  })

  it('remove um perfil e limpa o ativo', () => {
    criarPerfil(perfil)
    definirPerfilAtivo('p1')
    removerPerfil('p1')
    expect(listarPerfis()).toEqual([])
    expect(perfilAtivoId()).toBeNull()
  })

  it('dado corrompido no disco vira null em vez de quebrar', () => {
    localStorage.setItem('nfc:v1:perfil:p1', '{isso não é json')
    expect(carregarPerfil('p1')).toBeNull()
  })
})

describe('schema', () => {
  it('rejeita lixo e versões futuras', () => {
    expect(migrar(null)).toBeNull()
    expect(migrar({ versao: 1 })).toBeNull()
    expect(migrar({ ...novosDados(perfil), versao: VERSAO_ATUAL + 1 })).toBeNull()
  })

  it('preenche preferências que faltam', () => {
    const m = migrar({ versao: 1, perfil })
    expect(m?.preferencias.escalaFonte).toBe(1)
    expect(m?.fases).toEqual({})
  })
})

describe('código de backup', () => {
  it('exporta e importa sem perder nada, inclusive acentos e emoji', () => {
    const d = novosDados(perfil)
    d.fases['w0-tocar'] = { status: 'concluida', estrelas: 2, ultimaPratica: '2026-11-03', passosConcluidos: ['a', 'b'] }
    const r = importarCodigo(exportarCodigo(d))
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.dados).toEqual(d)
  })

  it('aceita o código com quebras de linha e espaços', () => {
    const codigo = exportarCodigo(novosDados(perfil))
    const quebrado = codigo.replace(/(.{20})/g, '$1\n ')
    expect(importarCodigo(quebrado).ok).toBe(true)
  })

  it('detecta código cortado pela metade', () => {
    const codigo = exportarCodigo(novosDados(perfil))
    const r = importarCodigo(codigo.slice(0, 40) + '-' + codigo.slice(-5))
    expect(r.ok).toBe(false)
  })

  it('rejeita texto qualquer', () => {
    expect(importarCodigo('olá mundo')).toEqual({ ok: false, motivo: 'formato' })
  })
})

describe('pin', () => {
  it('valida 4 dígitos', () => {
    expect(pinValido('1234')).toBe(true)
    expect(pinValido('123')).toBe(false)
    expect(pinValido('12a4')).toBe(false)
  })

  it('confere o hash', async () => {
    const h = await hashPin('4321')
    expect(await conferePin('4321', h)).toBe(true)
    expect(await conferePin('1234', h)).toBe(false)
  })
})
