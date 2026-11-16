import type { AppTransporte, BlocoApp, Fase, Passo, PainelCelular, TelaApp } from '../../core/engine/stepTypes'
import { toque as toqueApp } from '../transporte/passos'

// Mundo 1: o celular no dia a dia. Tudo é simulado em um painel simples (ver PainelCelular).

const ajustes = [
  { id: 'wifi', rotulo: 'Wi-Fi' },
  { id: 'som', rotulo: 'Som' },
  { id: 'brilho', rotulo: 'Brilho' },
  { id: 'bateria', rotulo: 'Bateria' },
]

type Opcoes = {
  id: string
  instrucao: string
  alvo: string
  elementos: NonNullable<Passo['elementos']>
  painel?: PainelCelular
  dicas: [string, string]
  erroGentil: string
  lembrete: string
}

function toque(o: Opcoes): Passo {
  return { tipo: 'tocar', ...o }
}

const maisMenos = [
  { id: 'menos', rotulo: '− Diminuir' },
  { id: 'mais', rotulo: '+ Aumentar' },
]

export const w1Volume: Fase = {
  id: 'w1-volume',
  guiaReal: 'volume',
  mundo: 1,
  titulo: 'Aumentar o volume',
  simulador: 'celular',
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'O seu celular tocou a manhã toda e você não atendeu. Era a Ana!' },
      { quem: 'neuza', texto: 'Ele está com o volume baixinho. Vamos aumentar? Abra os Ajustes e procure Som.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Agora ele toca tão alto que acorda até o galo.' }],
    premio: { emoji: '🔔', titulo: 'O toque da Ana' },
  },
  passos: [
    toque({
      id: 'abrir-som',
      instrucao: 'Toque em Som para mexer no volume.',
      alvo: 'som',
      elementos: ajustes,
      painel: { titulo: 'Ajustes', linhas: ['Escolha o que quer mudar.'] },
      dicas: ['Leia o nome de cada botão.', 'É o segundo botão: Som.'],
      erroGentil: 'Quase! Para o volume, toque em Som.',
      lembrete: 'O volume fica nos Ajustes, na opção Som.',
    }),
    toque({
      id: 'mais-1',
      instrucao: 'O volume está muito baixo. Toque em + Aumentar.',
      alvo: 'mais',
      elementos: maisMenos,
      painel: { titulo: 'Som', medidor: { rotulo: 'Volume', nivel: 1, max: 5 } },
      dicas: ['O sinal de mais aumenta, o de menos diminui.', 'Toque no botão + Aumentar.'],
      erroGentil: 'Esse botão diminui. Para ouvir melhor, toque em + Aumentar.',
      lembrete: 'O sinal + aumenta o volume e o sinal − diminui.',
    }),
    toque({
      id: 'mais-2',
      instrucao: 'Ainda está baixo. Toque em + Aumentar de novo.',
      alvo: 'mais',
      elementos: maisMenos,
      painel: { titulo: 'Som', medidor: { rotulo: 'Volume', nivel: 2, max: 5 } },
      dicas: ['As barrinhas mostram o volume: quanto mais cheias, mais alto.', 'Toque em + Aumentar mais uma vez.'],
      erroGentil: 'Quase! Toque em + Aumentar.',
      lembrete: 'As barrinhas cheias mostram o volume: mais barras, mais alto.',
    }),
    toque({
      id: 'testar',
      instrucao: 'Boa! Agora toque em Testar o toque para ouvir como ficou.',
      alvo: 'testar',
      elementos: [
        { id: 'testar', rotulo: '🔔 Testar o toque' },
        { id: 'menos', rotulo: '− Diminuir' },
      ],
      painel: { titulo: 'Som', medidor: { rotulo: 'Volume', nivel: 4, max: 5 } },
      dicas: ['Depois de ajustar, sempre vale testar.', 'Toque no botão com o sino: Testar o toque.'],
      erroGentil: 'Esse botão diminui o volume. Toque em Testar o toque.',
      lembrete: 'Depois de mudar o volume, toque em Testar para ouvir como ficou.',
    }),
  ],
}

const APP_CELULAR: AppTransporte = {
  id: 'celular',
  nome: 'Celular',
  tema: { corPrincipal: '#1b4b8f', corDestaque: '#1b4b8f', link: '#1b4b8f' },
  fonte: 'Barra de cima e painel rápido, como aparecem na maioria dos celulares Android e iPhone. O desenho muda de marca para marca.',
}


const celularBrilho = (etapa: 'puxar' | 'ajustar' | 'ler', valor: number, item: { rotulo: string; id: string }, limites: { minimo?: number; maximo?: number } = {}): TelaApp => ({
  blocos: [{ tipo: 'celularBrilho', etapa, valor, item, ...limites }],
})

export const w1Brilho: Fase = {
  id: 'w1-brilho',
  guiaReal: 'brilho',
  mundo: 1,
  titulo: 'Aumentar o brilho da tela',
  simulador: 'celular',
  aplicativo: APP_CELULAR,
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'Você saiu para a varanda e a tela ficou escura demais para ler.' },
      { quem: 'neuza', texto: 'O sol está forte. Faça como no celular de verdade: puxe a barra de cima e arraste o brilho.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Agora dá para ler até debaixo do sol.' }],
    premio: { emoji: '☀️', titulo: 'A varanda ensolarada' },
  },
  passos: [
    toqueApp(
      'puxar',
      'A tela do celular está escura. Ponha o dedo na bolinha laranja e arraste para baixo, como quem puxa uma cortina.',
      celularBrilho('puxar', 20, { rotulo: 'Bolinha da barra de cima', id: 'puxar' }),
      'puxar',
      'Bolinha da barra de cima',
      'No celular de verdade, o painel com o brilho aparece quando você puxa a parte de cima da tela para baixo.',
      'É a bolinha laranja no alto do celular. Arraste o dedo dela para baixo, sem soltar.',
    ),
    toqueApp(
      'ajustar',
      'O painel abriu! Arraste a barra do sol até o fim, para deixar a tela bem clara, e solte o dedo.',
      celularBrilho('ajustar', 20, { rotulo: 'Brilho', id: 'brilho-alto' }, { minimo: 80 }),
      'brilho-alto',
      'Brilho',
      'Quanto mais cheia a barra laranja, mais clara fica a tela. Pode ir até o final.',
      'É a barra com o desenho de um sol, dentro do painel. Encoste o dedo nela e arraste.',
    ),
    toqueApp(
      'ler',
      'Agora dá para ler! Toque na mensagem da Ana.',
      celularBrilho('ler', 100, { rotulo: 'Mensagem da Ana', id: 'abrir-msg' }),
      'abrir-msg',
      'Mensagem da Ana',
      'Gastar mais brilho consome mais bateria. Baixe de novo quando sair do sol.',
      'É o cartão branco no pé da tela do celular, com o nome da Ana.',
    ),
    toqueApp(
      'economizar',
      'Saiu do sol? Arraste a barra do sol um pouco para trás, até a metade, para economizar a bateria.',
      celularBrilho('ajustar', 100, { rotulo: 'Brilho', id: 'brilho-medio' }, { maximo: 70 }),
      'brilho-medio',
      'Brilho',
      'À sombra, um brilho médio já basta e a bateria dura mais.',
      'É a mesma barra. Arraste o sol para trás, até a metade ou menos.',
    ),
  ],
}

const APP_NAVEGADOR: AppTransporte = {
  id: 'navegador',
  nome: 'Navegador',
  tema: { corPrincipal: '#1b4b8f', corDestaque: '#1b4b8f', link: '#1b4b8f' },
  fonte: 'Site e janelas inventados, copiando o jeito dos anúncios que aparecem sozinhos. Nenhum endereço é real.',
}

/** Um site de receitas com uma janela de propaganda por cima. */
const siteComJanela = (janela: BlocoApp, depois: BlocoApp[] = []): TelaApp => ({
  escurecida: true,
  blocos: [
    { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar' }, titulo: 'receitas.com.br' },
    janela,
    { tipo: 'titulo', texto: 'Bolo de cenoura fofinho', apoio: 'Receita da Vovó · 12 comentários' },
    { tipo: 'texto', texto: 'Misture a cenoura, os ovos e o óleo no liquidificador. Depois junte a farinha e o fermento.' },
    ...depois,
  ],
})

export const w1Popup: Fase = {
  id: 'w1-popup',
  mundo: 1,
  titulo: 'Fechar pop-ups sem cair em armadilha',
  simulador: 'celular',
  aplicativo: APP_NAVEGADOR,
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Apareceu uma janela dizendo que eu ganhei um prêmio e ela não sai da tela!' },
      { quem: 'neuza', texto: 'Calma, Seu Osvaldo. O botão de fechar costuma ser pequeno. Os grandes e chamativos são armadilha.' },
      { quem: 'neuza', texto: 'Vamos treinar, {nome}: feche cada janela sem tocar no botão grande.' },
    ],
    fechamento: [{ quem: 'osvaldo', texto: 'Era só propaganda! Ainda bem que você estava aqui.' }],
    premio: { emoji: '🚫', titulo: 'O X escondido' },
  },
  passos: [
    toqueApp(
      'premio',
      'Apareceu uma janela. Feche no X pequeno. Não toque nos botões grandes.',
      siteComJanela({
        tipo: 'janela',
        titulo: '🎁 Parabéns! Você ganhou um prêmio!',
        texto: 'Só hoje. Toque rápido!',
        fechar: { rotulo: 'Fechar a janela', icone: '✕', id: 'x' },
        botoes: [{ rotulo: 'RESGATAR MEU PRÊMIO', id: 'resgatar' }, { rotulo: 'CONTINUAR', id: 'continuar' }],
      }),
      'x',
      'X (fechar)',
      'Prêmio que aparece sozinho é propaganda. O X que fecha é pequeno e fica no canto de cima da janela.',
      'É o X pequeno e cinza, no canto de cima, à direita da janela.',
    ),
    toqueApp(
      'notificacao',
      'Você não quer avisos. Toque no texto pequeno "Agora não".',
      siteComJanela({
        tipo: 'janela',
        titulo: '🔔 Receber as melhores receitas todo dia?',
        texto: 'É só tocar em Permitir!',
        botoes: [{ rotulo: 'PERMITIR AVISOS', id: 'permitir' }, { rotulo: 'Agora não', id: 'agora-nao', principal: false }],
      }),
      'agora-nao',
      'Agora não',
      'Quando uma janela só pergunta, a saída costuma ser um texto pequeno, abaixo do botão grande.',
      'É o texto pequeno e sublinhado, no pé da janela. Não é o botão grande.',
    ),
    toqueApp(
      'infectado',
      'O botão "FECHAR" é falso. Toque no X pequeno, no canto de cima à esquerda.',
      siteComJanela({
        tipo: 'janela',
        perigo: true,
        lado: 'esquerda',
        titulo: '⚠️ SEU CELULAR ESTÁ INFECTADO!',
        texto: '3 vírus encontrados. Limpe agora!',
        fechar: { rotulo: 'Fechar a janela', icone: '✕', id: 'x-esq' },
        botoes: [{ rotulo: 'LIMPAR AGORA', id: 'limpar' }, { rotulo: 'FECHAR', id: 'fechar-falso' }],
      }),
      'x-esq',
      'X (fechar)',
      'Aviso assustador que aparece sozinho é falso. Um botão escrito "Fechar" bem grande também pode ser armadilha.',
      'Olhe o canto de cima da janela, do lado esquerdo: há um X pequeno.',
    ),
    toqueApp(
      'faixa',
      'Feche este anúncio no X pequeno, sem tocar em "Pedir agora".',
      siteComJanela(
        { tipo: 'janela', titulo: 'Anúncio · Empréstimo fácil!', texto: 'Dinheiro na hora, sem consulta!', fechar: { rotulo: 'Fechar o anúncio', icone: '✕', id: 'x-faixa' }, botoes: [{ rotulo: 'PEDIR AGORA', id: 'pedir' }] },
        [{ tipo: 'texto', texto: 'Continue a receita: asse por 40 minutos.' }],
      ),
      'x-faixa',
      'X (fechar)',
      'Anúncio de empréstimo fácil que aparece sozinho pode ser golpe. Feche sem tocar no botão grande.',
      'É o X pequeno no canto de cima, à direita do anúncio.',
    ),
    toqueApp(
      'telefone',
      'A janela diz que há vírus e manda ligar. Toque no que você faz: "Fecho a janela e não ligo".',
      {
        blocos: [
          {
            tipo: 'janela',
            perigo: true,
            titulo: '☎️ VÍRUS! Ligue agora: 0800 123 456',
            botoes: [],
          },
          {
            tipo: 'lista',
            titulo: 'O que você faz?',
            itens: [
              { rotulo: 'Ligo para o número', id: 'ligar', icone: '📞' },
              { rotulo: 'Fecho a janela e não ligo', id: 'fechar', icone: '✅' },
              { rotulo: 'Instalo o que ele pedir', id: 'instalar', icone: '⬇️' },
            ],
          },
        ],
      },
      'fechar',
      'Fecho a janela e não ligo',
      'Quem aparece sozinho na tela pedindo para ligar é golpista.',
      'É a opção do meio, com um ✅: "Fecho a janela e não ligo".',
    ),
  ],
}

export const w1Print: Fase = {
  id: 'w1-print',
  guiaReal: 'print',
  mundo: 1,
  titulo: 'Tirar um print da tela',
  simulador: 'celular',
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'A Ana mandou o endereço da festa, mas a mensagem some depois de um tempo.' },
      { quem: 'neuza', texto: 'Tire um print da tela para guardar. Print é uma foto do que está na tela.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Guardado! Agora o endereço não foge mais.' }],
    premio: { emoji: '📍', titulo: 'O endereço da festa' },
  },
  passos: [
    toque({
      id: 'tirar',
      instrucao: 'Aperte ao mesmo tempo o botão de ligar e o de baixar o volume.',
      alvo: 'ligar-volume',
      elementos: [
        { id: 'so-ligar', rotulo: 'Só o botão de ligar' },
        { id: 'ligar-volume', rotulo: 'Ligar + baixar o volume' },
        { id: 'so-volume', rotulo: 'Só o volume' },
      ],
      painel: {
        titulo: 'Mensagem da Ana',
        linhas: ['“Almoço no domingo, ao meio-dia. Mercado Central, Av. Principal, 100.”'],
        estilo: 'mensagem',
      },
      dicas: ['O print é feito com dois botões juntos.', 'Toque em Ligar + baixar o volume.'],
      erroGentil: 'Sozinho não funciona. Para o print, use os dois botões juntos: ligar + baixar o volume.',
      lembrete:
        'Na maioria dos celulares, o print é feito apertando juntos o botão de ligar e o de baixar o volume. No iPhone, o botão lateral e o de aumentar o volume.',
    }),
    toque({
      id: 'ver',
      instrucao: 'Apareceu uma miniatura no canto. Toque nela para ver o print.',
      alvo: 'miniatura',
      elementos: [
        { id: 'miniatura', rotulo: '🖼️ Ver o print' },
        { id: 'ignorar', rotulo: 'Ignorar', discreto: true },
      ],
      painel: { titulo: '📸 Print salvo!', linhas: ['A imagem foi guardada na galeria.'] },
      dicas: ['A miniatura some em poucos segundos.', 'Toque em Ver o print.'],
      erroGentil: 'Quase! Toque em Ver o print para conferir se ficou bom.',
      lembrete: 'O print fica salvo na galeria de fotos. Confira se o texto ficou legível.',
    }),
  ],
}

export const fasesMundo1 = [w1Volume, w1Brilho, w1Popup, w1Print]
