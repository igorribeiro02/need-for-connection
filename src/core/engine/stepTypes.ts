// Contratos do jogo: o grupo todo escreve fases usando estes tipos.
// Regra: este arquivo não importa React nem nada de fora de core/.

export type TipoPasso =
  | 'tocar' // tocar em um elemento da tela simulada (resposta = id do alvo)
  | 'digitar' // digitar um texto
  | 'escolher' // escolher uma opção
  | 'arrastar' // arrastar um elemento até um destino
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
}

export type Simulador = 'banco' | 'mensagens' | 'arquivos' | 'celular'

export type Fase = {
  id: string // ex.: "w4-pix-chave"
  mundo: number
  titulo: string
  simulador: Simulador
  precisaEscolherBanco?: boolean
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
  rotulos: { pix: string; transferir: string; confirmar: string }
  tema: { corPrincipal: string; corDestaque: string }
}
