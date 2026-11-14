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
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'Hoje você paga a sua parte do bolo: R$ 25,00 para a Ana.' },
      { quem: 'neuza', texto: 'Lembra do e-mail que você digitou no primeiro dia? É a chave Pix dela.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Pix recebido! Bolo garantido. Obrigada, {nome}!' }],
    premio: { emoji: '🍰', titulo: 'O bolo da festa' },
  },
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
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Anotei a chave da Ana para você, {nome}. Pode pagar!' },
      { quem: 'neuza', texto: 'Espere. Antes de confirmar, veja o nome que aparece na tela.' },
    ],
    fechamento: [
      { quem: 'neuza', texto: 'O nome é de outra pessoa. Conferir evitou pagar a pessoa errada.' },
      { quem: 'osvaldo', texto: 'Anotei a chave errada... desculpe!' },
    ],
    premio: { emoji: '👀', titulo: 'O olho atento' },
  },
  passos: [],
  gerarPassos: (banco) => montarPix(banco, 'nome-diferente'),
}
