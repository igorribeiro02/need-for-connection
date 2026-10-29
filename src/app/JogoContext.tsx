import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { DadosPerfil, Perfil, Preferencias, ProgressoFase } from '../core/progress/schema'
import {
  carregarPerfil,
  criarPerfil,
  definirPerfilAtivo,
  listarPerfis,
  novoId,
  perfilAtivoId,
  salvarPerfil,
} from '../core/progress/storage'

type Jogo = {
  dados: DadosPerfil | null
  perfis: Perfil[]
  entrar: (id: string) => void
  sair: () => void
  criar: (perfil: Omit<Perfil, 'id'>) => void
  importar: (dados: DadosPerfil) => void
  atualizarPreferencias: (parcial: Partial<Preferencias>) => void
  atualizarFase: (faseId: string, mudar: (atual: ProgressoFase | undefined) => ProgressoFase) => void
  /** Muda vários campos de uma vez, sempre sobre o dado mais recente. */
  atualizar: (mudar: (atual: DadosPerfil) => DadosPerfil) => void
  salvouNoAparelho: boolean
}

const Contexto = createContext<Jogo | null>(null)

export function JogoProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<DadosPerfil | null>(() => {
    const id = perfilAtivoId()
    return id ? carregarPerfil(id) : null
  })
  const [perfis, setPerfis] = useState<Perfil[]>(() => listarPerfis())
  const [salvouNoAparelho, setSalvou] = useState(true)
  const recente = useRef(dados)
  useEffect(() => {
    recente.current = dados
  }, [dados])

  // aplica as preferências (letra grande e alto contraste) na página inteira
  useEffect(() => {
    const raiz = document.documentElement
    raiz.style.setProperty('--escala-fonte', String(dados?.preferencias.escalaFonte ?? 1))
    if (dados?.preferencias.altoContraste) raiz.setAttribute('data-contraste', 'alto')
    else raiz.removeAttribute('data-contraste')
  }, [dados?.preferencias.escalaFonte, dados?.preferencias.altoContraste])

  const atualizar = useCallback((mudar: (atual: DadosPerfil) => DadosPerfil) => {
    const atual = recente.current
    if (!atual) return
    const novos = mudar(atual)
    recente.current = novos
    setDados(novos)
    setSalvou(salvarPerfil(novos))
    setPerfis(listarPerfis())
  }, [])

  const entrar = useCallback((id: string) => {
    const d = carregarPerfil(id)
    if (d) {
      definirPerfilAtivo(id)
      setDados(d)
    }
  }, [])

  const sair = useCallback(() => {
    definirPerfilAtivo(null)
    setDados(null)
  }, [])

  const criar = useCallback((perfil: Omit<Perfil, 'id'>) => {
    const novo = criarPerfil({ ...perfil, id: novoId() })
    definirPerfilAtivo(novo.perfil.id)
    setDados(novo)
    setPerfis(listarPerfis())
  }, [])

  const importar = useCallback((importados: DadosPerfil) => {
    // se já existe um perfil com este id, ele é substituído pelo do backup
    salvarPerfil(importados)
    definirPerfilAtivo(importados.perfil.id)
    setDados(importados)
    setPerfis(listarPerfis())
  }, [])

  const atualizarPreferencias = useCallback(
    (parcial: Partial<Preferencias>) => atualizar((d) => ({ ...d, preferencias: { ...d.preferencias, ...parcial } })),
    [atualizar],
  )

  const atualizarFase = useCallback(
    (faseId: string, mudar: (atual: ProgressoFase | undefined) => ProgressoFase) =>
      atualizar((d) => ({ ...d, fases: { ...d.fases, [faseId]: mudar(d.fases[faseId]) } })),
    [atualizar],
  )

  const valor = useMemo<Jogo>(
    () => ({ dados, perfis, entrar, sair, criar, importar, atualizarPreferencias, atualizarFase, atualizar, salvouNoAparelho }),
    [dados, perfis, entrar, sair, criar, importar, atualizarPreferencias, atualizarFase, atualizar, salvouNoAparelho],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useJogo(): Jogo {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useJogo precisa estar dentro de JogoProvider')
  return ctx
}
