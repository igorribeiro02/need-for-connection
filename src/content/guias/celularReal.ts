// Como fazer, com as mãos, em um celular de verdade. Os botões e os gestos mudam um pouco de modelo para modelo
// e de versão para versão do sistema: o texto avisa isso. Fontes: guias gerais de Android e iPhone (Tom's Guide,
// Digital Citizen, suporte Apple e Xiaomi). Ainda precisa ser conferido nos aparelhos do grupo.

export type Marca = 'samsung' | 'motorola' | 'iphone' | 'xiaomi'
export type Tema = 'volume' | 'brilho' | 'print'

export const marcas: { id: Marca; nome: string }[] = [
  { id: 'samsung', nome: 'Samsung' },
  { id: 'motorola', nome: 'Motorola' },
  { id: 'iphone', nome: 'iPhone' },
  { id: 'xiaomi', nome: 'Xiaomi' },
]

export type Botoes = {
  /** lado onde ficam os botões de volume */
  ladoVolume: 'esquerda' | 'direita'
  /** o volume é uma peça só (gangorra) ou dois botões separados */
  volumeSeparado: boolean
  ladoLiga: 'esquerda' | 'direita'
  /** de onde o dedo começa para abrir o painel de brilho */
  painelDo: 'centro' | 'direita'
  /** quantas vezes o dedo precisa descer */
  vezesPainel: 1 | 2
  /** botão de volume que se aperta junto com o de ligar para tirar o print */
  printComVolume: 'mais' | 'menos'
}

export const botoes: Record<Marca, Botoes> = {
  samsung: { ladoVolume: 'direita', volumeSeparado: false, ladoLiga: 'direita', painelDo: 'direita', vezesPainel: 1, printComVolume: 'menos' },
  motorola: { ladoVolume: 'direita', volumeSeparado: false, ladoLiga: 'direita', painelDo: 'centro', vezesPainel: 2, printComVolume: 'menos' },
  iphone: { ladoVolume: 'esquerda', volumeSeparado: true, ladoLiga: 'direita', painelDo: 'direita', vezesPainel: 1, printComVolume: 'mais' },
  xiaomi: { ladoVolume: 'direita', volumeSeparado: false, ladoLiga: 'direita', painelDo: 'direita', vezesPainel: 1, printComVolume: 'menos' },
}

type Guia = { titulo: string; passos: string[]; nota?: string }

export const guias: Record<Tema, Record<Marca, Guia>> = {
  volume: {
    samsung: {
      titulo: 'Volume no Samsung',
      passos: [
        'Olhe a lateral DIREITA do celular. Os botões de volume ficam no alto, acima do botão de ligar.',
        'Aperte a parte de CIMA do botão de volume (+) para AUMENTAR.',
        'Aperte a parte de BAIXO (−) para DIMINUIR. Uma barrinha aparece na tela mostrando o volume.',
      ],
    },
    motorola: {
      titulo: 'Volume no Motorola',
      passos: [
        'Olhe a lateral DIREITA. O botão de volume fica acima do botão de ligar, que é mais fininho e áspero.',
        'Aperte a parte de CIMA (+) para AUMENTAR.',
        'Aperte a parte de BAIXO (−) para DIMINUIR. Uma barrinha aparece na tela.',
      ],
    },
    iphone: {
      titulo: 'Volume no iPhone',
      passos: [
        'Olhe a lateral ESQUERDA. Há dois botões redondos de volume, um em cima do outro.',
        'Aperte o botão de CIMA (+) para AUMENTAR.',
        'Aperte o botão de BAIXO (−) para DIMINUIR. Uma barrinha aparece na tela.',
      ],
      nota: 'O botãozinho mais acima de todos liga e desliga o som do toque (modo silencioso).',
    },
    xiaomi: {
      titulo: 'Volume no Xiaomi',
      passos: [
        'Olhe a lateral DIREITA. O botão de volume fica acima do botão de ligar.',
        'Aperte a parte de CIMA (+) para AUMENTAR.',
        'Aperte a parte de BAIXO (−) para DIMINUIR. Uma barrinha aparece na tela.',
      ],
    },
  },
  brilho: {
    samsung: {
      titulo: 'Brilho no Samsung',
      passos: [
        'Coloque o dedo no alto da tela, no canto de CIMA à DIREITA, e deslize para baixo.',
        'Abre o painel de atalhos. Procure a barrinha com um sol ☀.',
        'Arraste a bolinha para a DIREITA para clarear e para a ESQUERDA para escurecer.',
      ],
      nota: 'Em versões mais antigas, deslize do meio do alto da tela, uma ou duas vezes.',
    },
    motorola: {
      titulo: 'Brilho no Motorola',
      passos: [
        'Coloque o dedo no meio do alto da tela e deslize para baixo. Se só aparecerem avisos, deslize de novo.',
        'Abre o painel de atalhos. Procure a barrinha com um sol ☀.',
        'Arraste a bolinha para a DIREITA para clarear e para a ESQUERDA para escurecer.',
      ],
    },
    iphone: {
      titulo: 'Brilho no iPhone',
      passos: [
        'Coloque o dedo no canto de CIMA à DIREITA da tela e deslize para baixo.',
        'Abre a Central de Controle. Procure a barra comprida com um sol ☀.',
        'Arraste o dedo para CIMA para clarear e para BAIXO para escurecer.',
      ],
      nota: 'Em iPhone com botão redondo embaixo, o painel abre deslizando de BAIXO para CIMA.',
    },
    xiaomi: {
      titulo: 'Brilho no Xiaomi',
      passos: [
        'Coloque o dedo no canto de CIMA à DIREITA e deslize para baixo. É a Central de Controle.',
        'Procure a barrinha com um sol ☀.',
        'Arraste a bolinha para a DIREITA para clarear e para a ESQUERDA para escurecer.',
      ],
      nota: 'Em versões mais antigas, deslize do meio do alto da tela.',
    },
  },
  print: {
    samsung: {
      titulo: 'Print no Samsung',
      passos: [
        'Deixe na tela o que você quer guardar.',
        'Aperte ao mesmo tempo o botão de LIGAR e o de volume BAIXO (−), por um instante.',
        'A tela pisca. Pronto: o print fica salvo na Galeria.',
      ],
      nota: 'Outro jeito: passe a lateral da mão pela tela, da direita para a esquerda (se estiver ligado nos ajustes).',
    },
    motorola: {
      titulo: 'Print no Motorola',
      passos: [
        'Deixe na tela o que você quer guardar.',
        'Aperte ao mesmo tempo o botão de LIGAR e o de volume BAIXO (−), por cerca de 2 segundos.',
        'A tela pisca. Pronto: o print fica salvo na Galeria.',
      ],
      nota: 'Outro jeito: encoste TRÊS dedos na tela e segure um instante.',
    },
    iphone: {
      titulo: 'Print no iPhone',
      passos: [
        'Deixe na tela o que você quer guardar.',
        'Aperte ao mesmo tempo o botão LIGAR (lado direito) e o de volume CIMA (+), e solte logo.',
        'A tela pisca. Pronto: o print fica salvo em Fotos. Aparece uma miniatura no canto da tela.',
      ],
      nota: 'Em iPhone com botão redondo embaixo: aperte o botão redondo junto com o botão de ligar.',
    },
    xiaomi: {
      titulo: 'Print no Xiaomi',
      passos: [
        'Deixe na tela o que você quer guardar.',
        'Aperte ao mesmo tempo o botão de LIGAR e o de volume BAIXO (−), por um instante.',
        'A tela pisca. Pronto: o print fica salvo na Galeria.',
      ],
      nota: 'Outro jeito: deslize TRÊS dedos juntos de cima para baixo na tela.',
    },
  },
}

export const AVISO_VARIA = 'Os botões e os gestos mudam um pouco de modelo para modelo. Se o seu for diferente, procure um botão parecido.'
