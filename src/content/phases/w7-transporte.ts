import type { AppTransporte, Fase } from '../../core/engine/stepTypes'
import { VIAGEM } from '../transporte/dados'
import { digitar, pergunta, toque } from '../transporte/passos'
import { app99, uber } from '../transporte/telas'

const APP_UBER: AppTransporte = {
  id: 'uber',
  nome: 'Uber',
  tema: { corPrincipal: '#2d5bd8', corDestaque: '#1b4b8f', link: '#8fb0ff', escuro: true },
  fonte:
    'Capturas reais do app (nov/2026): início, "Planeje sua próxima viagem", escolha do carro, "Pague com" e "Confirme o local de partida". NÃO vistos em captura: busca de motorista, motorista a caminho, código da viagem (vem de tutoriais), cancelar e avaliação. Preços, endereços e formas de pagamento são inventados.',
}

const APP_99: AppTransporte = {
  id: '99',
  nome: '99',
  tema: { corPrincipal: '#1d1d1d', corDestaque: '#1b4b8f', faixa: { fundo: '#ffd100', texto: '#1d1d1d' }, link: '#1d1d1d' },
  fonte:
    'Capturas reais do app (nov/2026): início, busca "Para onde vamos?", escolha da categoria (Pop, Moto, Pop Expresso, Negocia, Táxi) e "Local de embarque anterior". Não sabemos a ORDEM entre a escolha da categoria e o embarque, nem o que vem depois de Solicitar (busca, motorista a caminho, cancelar). Preços e endereços são inventados.',
}

export const w7UberPedir: Fase = {
  id: 'w7-uber-pedir',
  mundo: 7,
  titulo: 'Pedir um Uber',
  simulador: 'transporte',
  aplicativo: APP_UBER,
  cenario: `Você precisa ir até o ${VIAGEM.destino}. Vamos pedir um carro no aplicativo, passo a passo. É só treino: nenhum carro vem de verdade.`,
  passos: [
    toque(
      'inicio',
      'Na tela inicial do Uber, toque em "Para onde?".',
      uber.inicio(),
      'para-onde',
      'Para onde?',
      'No Uber, o pedido começa na barra "Para onde?", no meio da tela inicial.',
      'É a barra grande e arredondada, com uma lupa, abaixo das abas Uber e Envios.',
    ),
    digitar(
      'destino',
      `Na caixa de destino, escreva o lugar aonde você vai: ${VIAGEM.destino}`,
      uber.destino(),
      VIAGEM.destino,
      'Para onde?',
      'Buscar',
      'Escreva o nome do lugar aonde você quer ir. O local de saída já vem preenchido com onde você está.',
    ),
    toque(
      'lugar',
      `Apareceram vários lugares parecidos. Toque no certo: "${VIAGEM.destino}", ${VIAGEM.enderecoDestino}.`,
      uber.resultados(),
      'lugar-certo',
      VIAGEM.destino,
      'Vários lugares têm nomes parecidos. Leia o endereço embaixo do nome e a distância antes de tocar: lugar errado, corrida errada.',
      `É o primeiro da lista, com o endereço ${VIAGEM.enderecoDestino}.`,
    ),
    toque(
      'categoria',
      'O app já deixou o Comfort marcado, que é mais caro. Escolha o mais barato: toque em "UberX".',
      uber.categorias('comfort'),
      'uberx',
      'UberX',
      'O app pode vir com um carro já marcado, e esse costuma ser o mais caro. Compare os preços e escolha você mesmo.',
      'É o segundo da lista, logo abaixo do Comfort.',
    ),
    toque(
      'pagamento',
      'Confira como você vai pagar: toque na linha "Pix".',
      uber.categorias('uberx'),
      'pagamento',
      'Pix',
      'Antes de pedir, confira a forma de pagamento. Toque na linha para ver as opções.',
      'É uma linha com o símbolo do Pix, logo acima do botão de baixo.',
    ),
    toque(
      'fechar-pagamento',
      'Aqui estão as formas de pagamento. Está tudo certo: toque no X para fechar.',
      uber.pagamento(),
      'fechar-pagamento',
      'X (fechar)',
      'O X fecha a tela sem mudar nada. Só troque a forma de pagamento se tiver certeza.',
      'É o X no canto de cima, à esquerda.',
    ),
    toque(
      'confirmar-uber',
      'De volta à tela dos carros, toque no botão "Escolher UberX".',
      uber.categorias('uberx'),
      'confirmar-uber',
      'Escolher UberX',
      'Antes de confirmar, confira o carro escolhido, o preço e a forma de pagamento.',
      'É o botão grande no pé da tela.',
    ),
    toque(
      'partida',
      'O app pergunta onde o carro vai buscar você. Está certo: toque em "Confirmar partida".',
      uber.partida(),
      'confirmar-partida',
      'Confirmar partida',
      'Confirme o local de partida. Se estiver errado, mova o marcador no mapa antes de tocar em Confirmar partida.',
      'É o botão grande no pé da tela.',
    ),
  ],
}

export const w799Pedir: Fase = {
  id: 'w7-99-pedir',
  mundo: 7,
  titulo: 'Pedir um carro na 99',
  simulador: 'transporte',
  aplicativo: APP_99,
  cenario: `Você precisa ir até o ${VIAGEM.destino}. Vamos pedir um carro no aplicativo da 99, passo a passo. É só treino: nenhum carro vem de verdade.`,
  passos: [
    toque(
      'inicio',
      'Na tela inicial da 99, toque em "Para onde vamos?".',
      app99.inicio(),
      'para-onde',
      'Para onde vamos?',
      'Na 99, o pedido começa na barra "Para onde vamos?", na tela inicial.',
      'É a barra grande e arredondada, com uma lupa, embaixo da faixa amarela.',
    ),
    digitar(
      'destino',
      `Na caixa com a bandeirinha, escreva o lugar aonde você vai: ${VIAGEM.destino}`,
      app99.destino(),
      VIAGEM.destino,
      'Para onde vamos?',
      'Buscar',
      'Escreva o nome do lugar aonde você quer ir. O local de saída já vem preenchido com onde você está.',
    ),
    toque(
      'lugar',
      `Apareceram vários lugares parecidos. Toque no certo: "${VIAGEM.destino}", ${VIAGEM.enderecoDestino}.`,
      app99.resultados(),
      'lugar-certo',
      VIAGEM.destino,
      'Vários lugares têm nomes parecidos. Leia o endereço embaixo do nome e a distância antes de tocar.',
      `É o primeiro da lista, com o endereço ${VIAGEM.enderecoDestino}.`,
    ),
    toque(
      'categoria',
      'O Pop (carro comum, 4 lugares) já vem marcado. Confira o preço no botão e toque em "Solicitar Pop".',
      app99.categorias(),
      'solicitar-pop',
      'Solicitar Pop',
      'A 99 mostra o preço no botão de baixo. Dá para marcar mais de uma categoria: confira sempre o que está marcado antes de solicitar.',
      'É o botão amarelo grande no pé da tela, com o preço.',
    ),
    toque(
      'embarque',
      'O app mostra o local onde o carro vai buscar você. Está certo: toque em "Solicitar".',
      app99.embarque(),
      'solicitar',
      'Solicitar',
      'Confira o local de embarque. Se estiver errado, toque em Editar antes de solicitar.',
      'É o botão grande no pé da tela.',
    ),
  ],
}

const opcoesSimNao = [
  { id: 'sim', rotulo: 'Sim, é o meu carro' },
  { id: 'nao', rotulo: 'Não, é diferente' },
]

export const w7ConferirMotorista: Fase = {
  id: 'w7-conferir-motorista',
  mundo: 7,
  titulo: 'Conferir o motorista antes de entrar',
  simulador: 'transporte',
  aplicativo: APP_UBER,
  cenario: 'Você pediu o carro e está esperando na calçada. Antes de entrar, confira se é o carro certo. Isso protege você de golpes e de erros.',
  passos: [
    pergunta(
      'placa-errada',
      `Parou um carro na sua frente. A placa dele é ${VIAGEM.placaOutroCarro}. Compare com a placa do app: é o seu carro?`,
      uber.motorista(false),
      opcoesSimNao,
      'nao',
      [`Leia a placa na tela do app: ${VIAGEM.placa}.`, `A placa do carro parado é ${VIAGEM.placaOutroCarro}, e não ${VIAGEM.placa}. Toque em "Não, é diferente".`],
      'Atenção! A placa do carro é diferente da do app. Não entre.',
      'A placa do carro precisa ser igual à placa que aparece no app. Se for diferente, não entre. Peça outro carro.',
    ),
    pergunta(
      'placa-certa',
      `Chegou outro carro: ${VIAGEM.carro}, placa ${VIAGEM.placa}. Compare com o app: é o seu carro?`,
      uber.motorista(false),
      opcoesSimNao,
      'sim',
      ['Compare o modelo, a cor e a placa com os dados da tela.', `A placa ${VIAGEM.placa} e o ${VIAGEM.carro} batem com o app. Toque em "Sim, é o meu carro".`],
      'Olhe de novo: o modelo, a cor e a placa são os mesmos do app. É o seu carro.',
      'Confira placa, modelo e cor antes de abrir a porta. Se tudo bater, pode seguir.',
    ),
    pergunta(
      'nome',
      'Você chegou perto do carro. O que fazer com o seu nome?',
      uber.motorista(false),
      [
        { id: 'esperar', rotulo: 'Esperar o motorista perguntar o meu nome' },
        { id: 'dizer', rotulo: 'Dizer o meu nome e para onde vou, antes de ele perguntar' },
      ],
      'esperar',
      ['Um golpista poderia fingir ser o motorista e pedir que você diga o nome primeiro.', 'Quem é o motorista de verdade já sabe o seu nome: espere ele perguntar.'],
      'Quase! Deixe o motorista perguntar o seu nome primeiro. Quem é o motorista de verdade já sabe quem você é.',
      'Espere o motorista perguntar o seu nome antes de embarcar. Se não perguntar ou errar o nome, não entre.',
    ),
    pergunta(
      'codigo',
      `O app mostra um código da viagem (${VIAGEM.codigo}). Para quem você diz o código?`,
      uber.motorista(true),
      [
        { id: 'motorista', rotulo: 'Para o motorista, antes de entrar no carro' },
        { id: 'qualquer', rotulo: 'Para qualquer pessoa que ligue pedindo o código' },
      ],
      'motorista',
      ['O código serve para o motorista começar a viagem com a pessoa certa.', 'Só o motorista do seu carro, pessoalmente, antes de entrar.'],
      'Quase! O código é só para o motorista do carro que você conferiu, pessoalmente. Nunca diga por telefone ou mensagem.',
      'O código da viagem é só para o motorista, ao entrar no carro. Nunca passe por telefone, mensagem ou para quem ligar pedindo.',
    ),
  ],
}
