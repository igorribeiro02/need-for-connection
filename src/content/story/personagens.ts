import type { PersonagemId } from '../../core/engine/stepTypes'

export type Personagem = {
  id: PersonagemId
  nome: string
  papel: string
  emoji: string
  /** Cor do balão (fundo) e da borda; todas com texto escuro por cima, contraste alto. */
  fundo: string
  borda: string
}

export const personagens: Record<PersonagemId, Personagem> = {
  neuza: {
    id: 'neuza',
    nome: 'Dona Neuza',
    papel: 'Sua vizinha',
    emoji: '👵',
    fundo: '#e8f1fb',
    borda: '#1b4b8f',
  },
  ana: {
    id: 'ana',
    nome: 'Ana',
    papel: 'Sua neta',
    emoji: '👩',
    fundo: '#fde9ef',
    borda: '#a8325c',
  },
  osvaldo: {
    id: 'osvaldo',
    nome: 'Seu Osvaldo',
    papel: 'Vizinho animado',
    emoji: '👴',
    fundo: '#fff4d6',
    borda: '#8a5a00',
  },
  sorrateiro: {
    id: 'sorrateiro',
    nome: 'Seu Sorrateiro',
    papel: 'Cuidado com ele',
    emoji: '🦊',
    fundo: '#eeeeee',
    borda: '#4a4a4a',
  },
  carlos: {
    id: 'carlos',
    nome: 'Carlos',
    papel: 'Motorista',
    emoji: '🧔',
    fundo: '#e5f4e4',
    borda: '#1c6b3a',
  },
}
