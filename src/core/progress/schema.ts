// Formato do que é salvo no aparelho. Toda mudança de formato aumenta VERSAO_ATUAL
// e ganha uma migração em migrar(), para ninguém perder o progresso.

export const VERSAO_ATUAL = 1

export type Perfil = {
  id: string
  nome: string
  avatar: string
  pinHash?: string // trava de conveniência, não é segurança de verdade
}

export type Preferencias = {
  escalaFonte: number // 1 = 100%, até 2 = 200%
  altoContraste: boolean
  narracao: boolean
}

export type StatusFase = 'nao-iniciada' | 'em-andamento' | 'concluida'

export type ProgressoFase = {
  status: StatusFase
  estrelas: 0 | 1 | 2 | 3
  banco?: string
  ultimaPratica?: string // data ISO (AAAA-MM-DD)
  passosConcluidos: string[]
  dicasUsadas?: number // dicas pedidas na tentativa em andamento (para a nota não zerar ao retomar)
}

export type DadosPerfil = {
  versao: number
  perfil: Perfil
  preferencias: Preferencias
  fases: Record<string, ProgressoFase>
}

export const PREFERENCIAS_PADRAO: Preferencias = {
  escalaFonte: 1,
  altoContraste: false,
  narracao: false,
}

export function novosDados(perfil: Perfil): DadosPerfil {
  return {
    versao: VERSAO_ATUAL,
    perfil,
    preferencias: { ...PREFERENCIAS_PADRAO },
    fases: {},
  }
}

/** Valida e atualiza dados vindos do disco ou de um código de backup. Devolve null se inválido. */
export function migrar(bruto: unknown): DadosPerfil | null {
  if (typeof bruto !== 'object' || bruto === null) return null
  const d = bruto as Partial<DadosPerfil>
  if (typeof d.versao !== 'number' || d.versao > VERSAO_ATUAL) return null
  if (!d.perfil || typeof d.perfil.id !== 'string' || typeof d.perfil.nome !== 'string') return null

  // (versão 1 é a atual: ainda não há migrações antigas)
  return {
    versao: VERSAO_ATUAL,
    perfil: {
      id: d.perfil.id,
      nome: d.perfil.nome,
      avatar: typeof d.perfil.avatar === 'string' ? d.perfil.avatar : '🙂',
      pinHash: typeof d.perfil.pinHash === 'string' ? d.perfil.pinHash : undefined,
    },
    preferencias: { ...PREFERENCIAS_PADRAO, ...(d.preferencias ?? {}) },
    fases: d.fases && typeof d.fases === 'object' ? d.fases : {},
  }
}
