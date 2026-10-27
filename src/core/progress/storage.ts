// Camada de armazenamento. Hoje usa localStorage; o histórico detalhado pode ir
// para IndexedDB depois, trocando só este arquivo (o resto do jogo usa esta interface).

import { migrar, novosDados, type DadosPerfil, type Perfil } from './schema'

const PREFIXO = 'nfc:v1'
const CHAVE_INDICE = `${PREFIXO}:perfis` // lista de ids de perfis
const CHAVE_ATIVO = `${PREFIXO}:ativo` // id do perfil em uso
const chavePerfil = (id: string) => `${PREFIXO}:perfil:${id}`

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null // modo anônimo ou dados bloqueados
  }
}

function gravar(chave: string, valor: string): boolean {
  try {
    localStorage.setItem(chave, valor)
    return true
  } catch {
    return false
  }
}

export function armazenamentoDisponivel(): boolean {
  const chave = `${PREFIXO}:teste`
  const ok = gravar(chave, '1')
  try {
    localStorage.removeItem(chave)
  } catch {
    /* ignora */
  }
  return ok
}

function lerIndice(): string[] {
  const bruto = ler(CHAVE_INDICE)
  if (!bruto) return []
  try {
    const lista = JSON.parse(bruto)
    return Array.isArray(lista) ? lista.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function listarPerfis(): Perfil[] {
  return lerIndice()
    .map((id) => carregarPerfil(id)?.perfil)
    .filter((p): p is Perfil => p !== undefined)
}

export function carregarPerfil(id: string): DadosPerfil | null {
  const bruto = ler(chavePerfil(id))
  if (!bruto) return null
  try {
    return migrar(JSON.parse(bruto))
  } catch {
    return null
  }
}

export function salvarPerfil(dados: DadosPerfil): boolean {
  const ok = gravar(chavePerfil(dados.perfil.id), JSON.stringify(dados))
  if (ok) {
    const indice = lerIndice()
    if (!indice.includes(dados.perfil.id)) {
      gravar(CHAVE_INDICE, JSON.stringify([...indice, dados.perfil.id]))
    }
  }
  return ok
}

export function criarPerfil(perfil: Perfil): DadosPerfil {
  const dados = novosDados(perfil)
  salvarPerfil(dados)
  return dados
}

export function perfilAtivoId(): string | null {
  return ler(CHAVE_ATIVO)
}

export function definirPerfilAtivo(id: string | null): void {
  if (id === null) {
    try {
      localStorage.removeItem(CHAVE_ATIVO)
    } catch {
      /* ignora */
    }
  } else {
    gravar(CHAVE_ATIVO, id)
  }
}

export function removerPerfil(id: string): void {
  try {
    localStorage.removeItem(chavePerfil(id))
  } catch {
    /* ignora */
  }
  gravar(CHAVE_INDICE, JSON.stringify(lerIndice().filter((x) => x !== id)))
  if (perfilAtivoId() === id) definirPerfilAtivo(null)
}

export function novoId(): string {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
