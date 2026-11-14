import type { Fase, Passo, PainelCelular } from '../../core/engine/stepTypes'

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

export const w1Popup: Fase = {
  id: 'w1-popup',
  mundo: 1,
  titulo: 'Fechar um pop-up',
  simulador: 'celular',
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Apareceu uma janela dizendo que eu ganhei um prêmio e ela não sai da tela!' },
      { quem: 'neuza', texto: 'Calma, Seu Osvaldo. O botão de fechar costuma ser pequeno. Os grandes, não toque.' },
      { quem: 'neuza', texto: 'Vamos treinar, {nome}: feche o que aparecer, sem tocar no botão grande.' },
    ],
    fechamento: [{ quem: 'osvaldo', texto: 'Era só propaganda! Ainda bem que você estava aqui.' }],
    premio: { emoji: '🚫', titulo: 'O X escondido' },
  },
  passos: [
    toque({
      id: 'premio',
      instrucao: 'Apareceu uma janela sozinha. Feche com o X, sem tocar no botão grande.',
      alvo: 'fechar',
      elementos: [
        { id: 'resgatar', rotulo: 'RESGATAR MEU PRÊMIO AGORA' },
        { id: 'fechar', rotulo: '✕ Fechar', discreto: true },
      ],
      painel: { titulo: '🎁 Parabéns! Você ganhou um prêmio!', linhas: ['Só hoje. Toque rápido!'], estilo: 'popup' },
      dicas: ['Prêmio que aparece sozinho costuma ser propaganda.', 'O botão pequeno, escrito Fechar, é o certo.'],
      erroGentil: 'Cuidado! Botão grande e chamativo costuma ser armadilha. Procure o ✕ Fechar.',
      lembrete: 'Janela que aparece sozinha com prêmio é propaganda. Feche pelo X, sem tocar no botão grande.',
    }),
    toque({
      id: 'instalar',
      instrucao: 'Agora a janela pede para instalar um aplicativo. Você não quer. O que tocar?',
      alvo: 'agora-nao',
      elementos: [
        { id: 'instalar', rotulo: 'INSTALAR AGORA' },
        { id: 'agora-nao', rotulo: 'Agora não', discreto: true },
      ],
      painel: { titulo: '📲 Instale o nosso aplicativo!', linhas: ['É grátis e muito rápido.'], estilo: 'popup' },
      dicas: ['Só instale aplicativos que você mesmo foi procurar.', 'Toque em Agora não.'],
      erroGentil: 'Quase! Você não pediu esse aplicativo. Toque em Agora não.',
      lembrete: 'Se você não pediu, não instale. Toque em Agora não ou no X.',
    }),
    toque({
      id: 'limpar',
      instrucao: 'Esta janela diz que o seu celular está lento. Feche sem tocar no botão grande.',
      alvo: 'x',
      elementos: [
        { id: 'limpar', rotulo: 'LIMPAR O CELULAR AGORA' },
        { id: 'x', rotulo: '✕', discreto: true },
      ],
      painel: { titulo: '⚠️ Seu celular está lento e infectado!', linhas: ['Toque para limpar agora.'], estilo: 'popup' },
      dicas: ['Aviso de “infectado” que aparece sozinho é falso.', 'O ✕ pequeno fecha a janela.'],
      erroGentil: 'Cuidado! Esse aviso é falso. Toque no ✕ pequeno para fechar.',
      lembrete: 'Aviso assustador que aparece sozinho é falso. Feche pelo ✕.',
    }),
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
