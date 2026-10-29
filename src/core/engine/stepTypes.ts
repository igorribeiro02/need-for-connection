// Contratos do jogo: o grupo todo escreve fases usando estes tipos.
// Regra: este arquivo não importa React nem nada de fora de core/.

import type { MapaDef } from '../world/grid'

export type TipoPasso =
  | 'tocar' // tocar em um elemento da tela simulada (resposta = id do alvo)
  | 'digitar' // digitar um texto
  | 'escolher' // escolher uma opção
  | 'arrastar' // arrastar um elemento até um destino
  | 'deslizar' // deslizar uma lista até uma ponta (resposta = "inicio" ou "fim")
  | 'andar' // levar o personagem até um objeto do mapa
  | 'julgar' // decidir "golpe" ou "seguro"

export type Passo = {
  id: string // ex.: "menu-pix"
  instrucao: string // frase curta: "Toque em Pix"
  tipo: TipoPasso
  alvo: string // elemento da tela simulada
  /** Botões da tela básica (usada nas fases simples). Os simuladores de banco etc. ignoram. */
  elementos?: { id: string; rotulo: string }[]
  esperado?: string | string[] // resposta certa (digitar, escolher, julgar)
  dicas: string[] // 1ª discreta, 2ª mostra onde tocar
  erroGentil: string // ex.: "Quase! Procure o botão verde"
  lembrete: string // texto que aparece no Modo Lembrar
  /** 'deslizar': de que ponta a lista começa (padrão: topo). */
  posicaoInicial?: 'topo' | 'fim'
  /** 'digitar': texto que já vem escrito na caixa (para treinar a apagar). */
  valorInicial?: string
  /** 'digitar': tipo de teclado que o celular abre. */
  teclado?: 'texto' | 'numero' | 'email' | 'valor' | 'senha'
  /** 'digitar': nome do campo e do botão de enviar. */
  rotuloCampo?: string
  rotuloBotao?: string
  /** Simulador de banco: como a tela aparece neste passo (os botões vêm de `elementos`). */
  tela?: { titulo: string; linhas?: string[] }
  /** 'andar': verbo do botão de confirmar, ex.: "Pegar" (padrão: "Escolher"). */
  acao?: string
}

export type Simulador = 'banco' | 'mensagens' | 'arquivos' | 'celular'

export type Fase = {
  id: string // ex.: "w4-pix-chave"
  mundo: number
  titulo: string
  simulador: Simulador
  precisaEscolherBanco?: boolean
  /** Mapa usado pelos passos 'andar' desta fase. */
  mapa?: MapaDef
  /** Situação em uma frase, mostrada acima do exercício. */
  cenario?: string
  /** Fases de banco: os passos mudam conforme o banco escolhido (menus e nomes diferentes). */
  gerarPassos?: (banco: BancoConfig) => Passo[]
  passos: Passo[]
}

export type Mundo = {
  numero: number
  titulo: string
  descricao: string
  fases: Fase[]
  obrigatorio?: boolean
}

/** Configuração de um banco simulado (ver seção "Simulador de bancos e Pix"). */
export type BancoConfig = {
  id: string // "banco-a"
  nomeNaLista: string // o que a pessoa vê ao escolher
  arquetipo: 'tradicional' | 'digital'
  caminhoAteOPix: string[] // ["home", "pagar-e-transferir", "pix"]
  rotulos: { pix: string; transferir: string; confirmar: string; menu?: string; pagar?: string }
  tema: { corPrincipal: string; corDestaque: string }
}
