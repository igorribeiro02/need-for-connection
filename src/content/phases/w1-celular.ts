import type { AppTransporte, BlocoApp, Fase, Passo, PainelCelular, TelaApp } from '../../core/engine/stepTypes'
import { pergunta as perguntaApp, toque as toqueApp } from '../transporte/passos'

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

export const w1Brilho: Fase = {
  id: 'w1-brilho',
  mundo: 1,
  titulo: 'Aumentar o brilho da tela',
  simulador: 'celular',
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'Você saiu para a varanda e a tela ficou escura demais para ler.' },
      { quem: 'neuza', texto: 'O sol está forte. Aumente o brilho para ver a mensagem da Ana.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Agora dá para ler até debaixo do sol.' }],
    premio: { emoji: '☀️', titulo: 'A varanda ensolarada' },
  },
  passos: [
    toque({
      id: 'abrir-brilho',
      instrucao: 'A tela está escura. Toque em Brilho.',
      alvo: 'brilho',
      elementos: ajustes,
      painel: { titulo: 'Ajustes', linhas: ['Quase não dá para ler.'], estilo: 'escuro' },
      dicas: ['O brilho é a luz da tela.', 'Toque no botão Brilho.'],
      erroGentil: 'Quase! Para clarear a tela, toque em Brilho.',
      lembrete: 'A luz da tela se muda nos Ajustes, em Brilho.',
    }),
    toque({
      id: 'mais-1',
      instrucao: 'Toque em + Aumentar para clarear a tela.',
      alvo: 'mais',
      elementos: maisMenos,
      painel: { titulo: 'Tela', medidor: { rotulo: 'Brilho', nivel: 1, max: 4 }, estilo: 'escuro' },
      dicas: ['O sinal + deixa a tela mais clara.', 'Toque em + Aumentar.'],
      erroGentil: 'Esse botão escurece a tela. Toque em + Aumentar.',
      lembrete: 'O sinal + clareia a tela e o sinal − escurece.',
    }),
    toque({
      id: 'mais-2',
      instrucao: 'Ainda está escura. Toque em + Aumentar de novo.',
      alvo: 'mais',
      elementos: maisMenos,
      painel: { titulo: 'Tela', medidor: { rotulo: 'Brilho', nivel: 2, max: 4 }, estilo: 'escuro' },
      dicas: ['Cada toque clareia um pouquinho.', 'Toque em + Aumentar mais uma vez.'],
      erroGentil: 'Quase! Toque em + Aumentar.',
      lembrete: 'Cada toque em + clareia um pouco. Toque até conseguir ler bem.',
    }),
    toque({
      id: 'mais-3',
      instrucao: 'Mais uma vez, para ficar bem clara.',
      alvo: 'mais',
      elementos: maisMenos,
      painel: { titulo: 'Tela', medidor: { rotulo: 'Brilho', nivel: 3, max: 4 }, linhas: ['Já dá para ler melhor.'] },
      dicas: ['Falta pouco.', 'Toque em + Aumentar.'],
      erroGentil: 'Quase! Toque em + Aumentar.',
      lembrete: 'No sol forte, deixe o brilho bem alto.',
    }),
    toque({
      id: 'pronto',
      instrucao: 'Agora dá para ler! Toque em Pronto para terminar.',
      alvo: 'pronto',
      elementos: [
        { id: 'pronto', rotulo: 'Pronto' },
        { id: 'menos', rotulo: '− Diminuir' },
      ],
      painel: { titulo: 'Tela', medidor: { rotulo: 'Brilho', nivel: 4, max: 4 }, linhas: ['Mensagem da Ana: “Bom dia! Já acordou?”'] },
      dicas: ['O brilho já está bom.', 'Toque no botão Pronto.'],
      erroGentil: 'Isso escurece a tela. Toque em Pronto.',
      lembrete: 'Gastar mais brilho consome mais bateria. Baixe de novo quando sair do sol.',
    }),
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
    perguntaApp(
      'telefone',
      'Uma janela diz "Seu celular tem vírus! Ligue agora para 0800 123 456". O que você faz?',
      siteComJanela({ tipo: 'janela', perigo: true, titulo: '☎️ VÍRUS! Ligue agora: 0800 123 456', texto: 'Um técnico vai ajudar.', botoes: [{ rotulo: 'LIGAR', id: 'ligar-x' }] }),
      [
        { id: 'ligar', rotulo: 'Ligo para o número' },
        { id: 'fechar', rotulo: 'Fecho a janela e não ligo' },
        { id: 'instalar', rotulo: 'Instalo o que ele pedir' },
      ],
      'fechar',
      ['Quem aparece sozinho na tela pedindo para ligar é golpista.', 'Feche a janela e não ligue.'],
      'Quase! Nunca ligue nem instale nada por causa de um aviso que apareceu sozinho.',
      'Aviso na tela pedindo para ligar é golpe. Feche e ignore.',
    ),
  ],
}

export const w1Print: Fase = {
  id: 'w1-print',
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
