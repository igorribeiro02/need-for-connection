import type { Fase } from '../../core/engine/stepTypes'
import { montarPix } from '../banco/montarPix'

// Os passos são gerados para o banco escolhido (ver content/banco/montarPix.ts).
export const w4PixChave: Fase = {
  id: 'w4-pix-chave',
  mundo: 4,
  titulo: 'Fazer um Pix pela chave',
  simulador: 'banco',
  precisaEscolherBanco: true,
  cenario: 'Situação: você vai pagar R$ 25,00 para a Ana, sua neta. Ela passou o e-mail dela como chave Pix.',
  passos: [],
  gerarPassos: (banco) => montarPix(banco, 'normal'),
}

export const w4PixNome: Fase = {
  id: 'w4-pix-nome',
  mundo: 4,
  titulo: 'Conferir o nome antes de enviar',
  simulador: 'banco',
  precisaEscolherBanco: true,
  cenario: 'Situação: você vai pagar a Ana, mas na hora de conferir o nome na tela é de outra pessoa. O que fazer?',
  passos: [],
  gerarPassos: (banco) => montarPix(banco, 'nome-diferente'),
}
