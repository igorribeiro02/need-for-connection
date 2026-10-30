import type { AppTransporte, Fase } from '../../core/engine/stepTypes'
import { VIAGEM } from '../transporte/dados'
import { digitar, pergunta, toque } from '../transporte/passos'
import { app99, uber } from '../transporte/telas'

const APP_UBER: AppTransporte = {
  id: 'uber',
  nome: 'Uber',
  tema: { corPrincipal: '#111111', corDestaque: '#1b4b8f', link: '#111111' },
  fonte:
    'Páginas e tutoriais (Uber, Tecnoblog, Olhar Digital, 2024/2025): campo "Para onde?", escolha do carro, forma de pagamento, "Confirmar Uber", confirmação do local de partida, U-Código. NÃO conferido no app de hoje: ícones, ordem das telas, preços de exemplo, menu de baixo, como cancelar.',
}

const APP_99: AppTransporte = {
  id: '99',
  nome: '99',
  tema: { corPrincipal: '#1d1d1d', corDestaque: '#1b4b8f', faixa: { fundo: '#ffd100', texto: '#1d1d1d' }, link: '#1d1d1d' },
  fonte:
    'Central de ajuda da 99 e Tecnoblog: campo "Para onde vamos?", categorias (Poupa, Pop, Comfort, Táxi comum), pagamento, "Confirmar" e "Tudo certo, pode chamar!". NÃO conferido no app de hoje: ícones, ordem das telas, preços de exemplo, menu de baixo, como cancelar.',
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
      'No Uber, o pedido começa na barra "Para onde?", no alto da tela inicial.',
      'É a barra grande e arredondada, com uma lupa, perto do alto da tela.',
    ),
    digitar(
      'destino',
      `Na caixa "Para onde?", escreva o lugar aonde você vai: ${VIAGEM.destino}`,
      uber.destino(),
      VIAGEM.destino,
      'Para onde?',
      'Buscar',
      'Escreva o nome do lugar aonde você quer ir. O local de saída já vem preenchido com onde você está.',
    ),
    toque(
      'categoria',
      'Escolha o carro mais barato: toque em "UberX".',
      uber.categorias(false),
      'uberx',
      'UberX',
      'O app mostra os carros disponíveis com o preço de cada um. Compare antes de escolher.',
      'Cada carro tem uma caixa com o preço. O UberX é o de cima.',
    ),
    toque(
      'confirmar-uber',
      'Confira embaixo como você vai pagar (dinheiro) e toque em "Confirmar UberX".',
      uber.categorias(true),
      'confirmar-uber',
      'Confirmar UberX',
      'Antes de confirmar, confira o carro escolhido, o preço e a forma de pagamento.',
      'É o botão grande no pé da tela.',
    ),
    toque(
      'partida',
      'O app pergunta onde o carro vai buscar você. Está certo: toque em "Confirmar".',
      uber.partida(),
      'confirmar-partida',
      'Confirmar',
      'Confirme o local de partida. Se estiver errado, mova o marcador no mapa antes de tocar em Confirmar.',
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
      `Na caixa "Para onde vamos?", escreva o lugar aonde você vai: ${VIAGEM.destino}`,
      app99.destino(),
      VIAGEM.destino,
      'Para onde vamos?',
      'Buscar',
      'Escreva o nome do lugar aonde você quer ir. O local de saída já vem preenchido com onde você está.',
    ),
    toque(
      'categoria',
      'Escolha a categoria mais comum: toque em "Pop".',
      app99.categorias(false),
      'pop',
      'Pop',
      'A 99 tem categorias com preços diferentes (Poupa, Pop, Comfort, Táxi comum). Compare antes de escolher.',
      'Cada categoria tem uma caixa com o preço. O Pop é a segunda.',
    ),
    toque(
      'confirmar',
      'Confira a categoria e como você vai pagar (dinheiro). Depois toque em "Confirmar".',
      app99.categorias(true),
      'confirmar',
      'Confirmar',
      'Confira a categoria e a forma de pagamento antes de tocar em Confirmar.',
      'É o botão grande no pé da tela.',
    ),
    toque(
      'tudo-certo',
      'O app mostra onde o carro vai buscar você. Está certo: toque em "Tudo certo, pode chamar!".',
      app99.partida(),
      'tudo-certo',
      'Tudo certo, pode chamar!',
      'Confira o local de embarque. Se estiver certo, toque em "Tudo certo, pode chamar!" para chamar o carro.',
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
