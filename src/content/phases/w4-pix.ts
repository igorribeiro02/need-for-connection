import type { Fase } from '../../core/engine/stepTypes'
import { montarPix } from '../banco/montarPix'

// Os passos são gerados para o banco escolhido (ver content/banco/montarPix.ts).
export const w4PixChave: Fase = {
  id: 'w4-pix-chave',
  mundo: 3,
  titulo: 'Pix pela chave: e-mail',
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

export const w4PixCelular: Fase = {
  id: 'w4-pix-celular',
  mundo: 3,
  titulo: 'Pix pela chave: celular',
  simulador: 'banco',
  precisaEscolherBanco: true,
  cenario: 'Situação: você vai pagar R$ 25,00 para a Ana. Desta vez, ela passou o número do celular dela como chave Pix.',
  historia: {
    abertura: [
      { quem: 'ana', texto: 'Vó, esqueci o meu e-mail! Pode me pagar pelo número do celular?' },
      { quem: 'neuza', texto: 'O celular também pode ser uma chave Pix. Digite com o DDD na frente.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Chegou na hora, vó! O número do celular funciona igual.' }],
    premio: { emoji: '📱', titulo: 'A chave do celular' },
  },
  passos: [],
  gerarPassos: (banco) => montarPix(banco, 'normal', 'celular'),
}

export const w4PixCpf: Fase = {
  id: 'w4-pix-cpf',
  mundo: 3,
  titulo: 'Pix pela chave: CPF',
  simulador: 'banco',
  precisaEscolherBanco: true,
  cenario: 'Situação: você vai pagar R$ 25,00 à Dona Lúcia, que fez os docinhos da festa. A chave dela é o CPF.',
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Dona {nome}, a Lúcia fez os docinhos! Ela me passou o CPF para o Pix.' },
      { quem: 'neuza', texto: 'O CPF tem 11 números. Digite com calma e confira cada um.' },
    ],
    fechamento: [{ quem: 'osvaldo', texto: 'Docinhos pagos! A festa já está mais doce.' }],
    premio: { emoji: '🪪', titulo: 'O CPF certo' },
  },
  passos: [],
  gerarPassos: (banco) => montarPix(banco, 'normal', 'cpf'),
}

export const w4PixCnpj: Fase = {
  id: 'w4-pix-cnpj',
  mundo: 3,
  titulo: 'Pix pela chave: CNPJ (empresa)',
  simulador: 'banco',
  precisaEscolherBanco: true,
  cenario: 'Situação: você vai pagar R$ 25,00 à padaria Pão Quente. A chave dela é o CNPJ, o número da empresa.',
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'A padaria entregou os pães da festa. No cartaz do caixa está o CNPJ dela.' },
      { quem: 'neuza', texto: 'CNPJ é o "CPF" das empresas: tem 14 números. Escolha CPF ou CNPJ e digite.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Pães pagos! Para empresas, a chave costuma ser o CNPJ.' }],
    premio: { emoji: '🥖', titulo: 'A conta da padaria' },
  },
  passos: [],
  gerarPassos: (banco) => montarPix(banco, 'normal', 'cnpj'),
}

export const w4PixNome: Fase = {
  id: 'w4-pix-nome',
  mundo: 3,
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
