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
  elementos?: {
    id: string
    rotulo: string
    icone?: string
    /** Tela inicial do banco: onde o botão aparece (pílula de saldo, grade de atalhos ou lista de serviços). */
    grupo?: 'saldo' | 'atalho' | 'servico'
    detalhe?: string // segunda linha, nos itens da lista de serviços
  }[]
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
  tela?: {
    titulo: string
    linhas?: string[]
    saldo?: string // cartão de saldo (use "••••••" para saldo escondido)
    resumo?: { rotulo: string; valor: string }[] // conferência: "Para", "Valor"...
    layout?: 'grade' | 'lista' | 'inicio' | 'menu-pix' // 'inicio' = tela inicial do app; 'menu-pix' = tela do Pix do banco
    inicio?: { secaoAtalhos: string; secaoServicos?: string; colunas: number }
    menuPix?: MenuPix
  }
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

/** Como o Pix por chave funciona em um banco. Cada banco tem o seu fluxo (ordem das telas e nomes dos botões). */
export type FluxoPix = {
  entradaPix: string // atalho na tela inicial: "Pix", "Área Pix"
  /** Botões entre o Pix e a escolha da chave. Vazio quando `menuPix` existe (a chave é digitada na própria tela do Pix). */
  caminho: { rotulo: string; dica?: string }[]
  /** Bancos cuja tela do Pix já tem o campo da chave (sem escolher o tipo da chave antes). */
  menuPix?: MenuPix
  ordem: 'chave-primeiro' | 'valor-primeiro'
  rotuloAvancar: string // botão depois de digitar: "Continuar", "Avançar"
  /** Telas a mais que alguns bancos têm. */
  extras: ('confirmar-destinatario' | 'conta' | 'data')[]
  rotuloConfirmar: string // botão que envia o Pix
  confirmacao: { nome: 'senha' | 'assinatura eletrônica'; digitos: number }
}

/** Tela do Pix de um banco: campo da chave no alto, botões de apoio e atalhos de outros serviços. Só o campo funciona no exercício. */
export type MenuPix = {
  titulo: string // "Como você quer transferir?"
  rotuloCampo: string // "Digitar ou colar nome/chave"
  dicaCampo?: string // texto pequeno abaixo do campo
  botoes: { rotulo: string; icone: string }[] // ao lado do campo
  secaoMais?: string // "Mais opções"
  mais?: { rotulo: string; icone: string }[]
  secaoOutros?: string // "Outros Serviços"
  outros?: { rotulo: string; icone: string }[]
}

/** Como é a tela inicial do aplicativo: grade de atalhos e, às vezes, uma lista de serviços. */
export type InicioBanco = {
  secaoAtalhos: string // "Movimente sua conta"
  secaoServicos?: string // "Serviços e Produtos"
  colunas: number // atalhos por fileira
  atalhos: { rotulo: string; icone: string }[] // deve conter o atalho do Pix (fluxo.entradaPix)
  servicos?: { rotulo: string; detalhe: string; icone: string }[]
}

/** Configuração de um banco simulado (ver seção "Simulador de bancos e Pix"). */
export type BancoConfig = {
  id: string // "nubank"
  nomeNaLista: string // o que a pessoa vê ao escolher
  fluxo: FluxoPix
  inicio: InicioBanco
  tema: { corPrincipal: string; corDestaque: string }
  fonte: string // de onde veio o fluxo (para o grupo conferir no app real)
}
