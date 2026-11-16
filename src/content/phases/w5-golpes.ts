import type { AppTransporte, BlocoApp, Fase, Passo, TelaApp } from '../../core/engine/stepTypes'
import { pergunta, toque } from '../transporte/passos'

const APP_MSG: AppTransporte = {
  id: 'mensagens',
  nome: 'Mensagens',
  tema: { corPrincipal: '#1b4b8f', corDestaque: '#1b4b8f', link: '#1b4b8f' },
  fonte:
    'Mensagens de golpe inventadas a partir de modelos que circulam (falso banco, falso prêmio, falso parente). Nenhum número, link ou nome é real.',
}

const mensagem = (de: string, texto: string, extra: BlocoApp[] = []): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar' }, titulo: de },
    { tipo: 'cartao', titulo: texto },
    { tipo: 'espaco' },
    ...extra,
  ],
})

/** "Golpe ou seguro?" Mostra a mensagem e dois botões; a resposta certa vem em `certo`. */
function julgarMensagem(id: string, de: string, texto: string, certo: 'golpe' | 'seguro', pista: string, dicas: string[]): Passo {
  return {
    ...pergunta(
      id,
      'Leia a mensagem com calma. É golpe ou é seguro?',
      mensagem(de, texto),
      [
        { id: 'golpe', rotulo: '🚫 Golpe' },
        { id: 'seguro', rotulo: '✅ Seguro' },
      ],
      certo,
      dicas,
      `Quase! ${pista}`,
      'Desconfie de pressa, prêmio e pedido de dinheiro ou de código.',
    ),
    tipo: 'julgar',
  }
}

export const w5Mensagens: Fase = {
  id: 'w5-mensagens',
  mundo: 5,
  titulo: 'Golpe ou seguro?',
  simulador: 'mensagens',
  aplicativo: APP_MSG,
  historia: {
    abertura: [
      { quem: 'sorrateiro', texto: 'Hehe... mensagens, mensagens! Quem cai, perde o dinheirinho.' },
      { quem: 'neuza', texto: 'Cuidado, {nome}! Leia cada mensagem e diga se é golpe ou se é seguro.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Você enxergou todos. Quem desconfia no tempo certo não cai.' }],
    premio: { emoji: '🕵️', titulo: 'Olho de águia' },
  },
  passos: [
    julgarMensagem(
      'premio',
      '+55 21 9xxxx-0000',
      'PARABÉNS! Você ganhou um celular novo! Clique agora: premio-gratis.xyz/retirar. Só hoje!',
      'golpe',
      'Prêmio que você não pediu, com pressa e um link estranho, é golpe.',
      ['Você participou de algum sorteio?', 'Prêmio de graça, com pressa e link estranho: é golpe.'],
    ),
    julgarMensagem(
      'filha',
      'Ana',
      'Vó, cheguei na casa da Maria. Chego em casa às 18h, tá? Beijo!',
      'seguro',
      'Essa é só um aviso de chegada, vindo da sua neta que você conhece.',
      ['Quem mandou? É alguém que você conhece?', 'É a sua neta avisando a hora: não pede dinheiro nem código.'],
    ),
    julgarMensagem(
      'banco',
      'BANCO-SEGURO',
      'Sua conta será BLOQUEADA em 1 hora. Atualize os dados em banco-seguro-app.com/atualizar para evitar.',
      'golpe',
      'Banco de verdade não manda link para "atualizar dados" com ameaça de bloqueio.',
      ['Bancos não ameaçam bloquear a conta por mensagem.', 'Pressa, ameaça e link para "atualizar dados": é golpe.'],
    ),
    julgarMensagem(
      'consulta',
      'Posto de Saúde',
      'Lembrete: sua consulta é amanhã, às 9h, no Posto de Saúde da Rua das Flores. Não precisa responder.',
      'seguro',
      'É um lembrete de uma consulta que você marcou, sem link e sem pedir nada.',
      ['Você marcou essa consulta? Pede dinheiro ou link?', 'Só avisa o horário de uma consulta marcada: é seguro.'],
    ),
    julgarMensagem(
      'entrega',
      'Entregas',
      'Seu pacote não pôde ser entregue. Pague a taxa de R$ 4,90 em entrega-rapida.top/taxa para receber.',
      'golpe',
      'Taxa surpresa por link é golpe. Você nem estava esperando um pacote.',
      ['Você está esperando algum pacote?', 'Cobrar uma "taxinha" por link estranho é golpe.'],
    ),
  ],
}

// ---------------------------------------------------------------- Fase 5.2: ligação do falso banco
const ligacao = (texto: string, botoes: { rotulo: string; id: string; icone: string }[]): TelaApp => ({
  escuro: true,
  blocos: [
    { tipo: 'titulo', texto: 'Ligação', apoio: 'Número desconhecido · 0800 xxx' },
    { tipo: 'cartao', titulo: texto },
    { tipo: 'espaco' },
    { tipo: 'lista', estilo: 'caixas', itens: botoes },
  ],
})

export const w5Ligacao: Fase = {
  id: 'w5-ligacao',
  mundo: 5,
  titulo: 'A ligação do "banco"',
  simulador: 'mensagens',
  aplicativo: APP_MSG,
  historia: {
    abertura: [
      { quem: 'sorrateiro', texto: 'Alô, alô... aqui é do seu banco. Passe o código, rapidinho.' },
      { quem: 'neuza', texto: 'O telefone está tocando! Atenda e veja o que ele diz.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Muito bem! Desligou e ligou para o número do cartão. É assim que se faz.' }],
    premio: { emoji: '☎️', titulo: 'Desliga e confere' },
  },
  passos: [
    toque(
      'atender',
      'Um número desconhecido está ligando. Toque em "Atender" para ouvir.',
      ligacao('📞 Chamada recebida…', [
        { rotulo: 'Recusar', id: 'recusar', icone: '🔴' },
        { rotulo: 'Atender', id: 'atender', icone: '🟢' },
      ]),
      'atender',
      'Atender',
      'Para o jogo, atenda e escute o que ele pede. Na vida real, pode recusar.',
      'É o botão verde.',
    ),
    pergunta(
      'codigo',
      'A voz pede o código que chegou por mensagem. O que você faz?',
      ligacao('🗣️ "Sou do seu banco. Rápido, diga o código de 6 números que chegou no seu celular."', []),
      [
        { id: 'dar-codigo', rotulo: 'Passo o código, é do banco' },
        { id: 'desligar', rotulo: 'Desligo e ligo para o número do meu cartão' },
        { id: 'esperar', rotulo: 'Peço para ele ligar mais tarde' },
      ],
      'desligar',
      ['O banco de verdade nunca pede o código.', 'Desligue e ligue você, pelo número que está no cartão.'],
      'Quase! Nunca passe o código. Desligue e ligue para o número do cartão.',
      'Banco nenhum pede senha ou código por telefone.',
    ),
    toque(
      'desligar',
      'Toque em "Desligar" para encerrar a ligação.',
      ligacao('🗣️ "Alô? Está me ouvindo? Passe o código!"', [
        { rotulo: 'Passar o código', id: 'passar', icone: '🔢' },
        { rotulo: 'Desligar', id: 'desligar', icone: '🔴' },
      ]),
      'desligar',
      'Desligar',
      'Desligar é seguro. Passar o código entrega a sua conta.',
      'É o botão vermelho.',
    ),
    toque(
      'bloquear',
      'Para ele não ligar de novo, toque em "Bloquear número".',
      {
        escuro: true,
        blocos: [
          { tipo: 'titulo', texto: 'Ligação encerrada', apoio: 'Número desconhecido' },
          {
            tipo: 'lista',
            itens: [
              { rotulo: 'Ligar de volta', icone: '📞', id: 'ligar-volta' },
              { rotulo: 'Bloquear número', icone: '🚫', id: 'bloquear' },
              { rotulo: 'Salvar contato', icone: '➕', id: 'salvar' },
            ],
          },
        ],
      },
      'bloquear',
      'Bloquear número',
      'Bloquear impede que o mesmo número ligue de novo.',
      'É o do meio, com um sinal de proibido.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 5.3: falso parente
const zapFalso = (msgs: string[], extra: BlocoApp[] = []): TelaApp => ({
  blocos: [
    {
      tipo: 'barra',
      voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar' },
      titulo: 'Número novo',
      acoes: [{ rotulo: 'Menu', icone: '⋮', id: 'menu' }],
    },
    ...msgs.map((t): BlocoApp => ({ tipo: 'cartao', titulo: t })),
    { tipo: 'espaco' },
    ...extra,
  ],
})

const PEDIDO = [
  'Oi vó! Troquei de número, salva este.',
  'Preciso pagar uma conta urgente. Pode fazer um Pix de R$ 800 agora? Depois explico!',
]

export const w5Parente: Fase = {
  id: 'w5-parente',
  mundo: 5,
  titulo: 'Oi, vó! Mudei de número',
  simulador: 'mensagens',
  aplicativo: APP_MSG,
  historia: {
    abertura: [
      { quem: 'sorrateiro', texto: 'Oi, vovó! Sou eu, seu netinho... mande um Pix, vai?' },
      { quem: 'neuza', texto: 'Parece a Ana, mas o número é novo. Vamos conferir antes de qualquer coisa.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Vó, esse número não era o meu! Ainda bem que você desconfiou.' }],
    premio: { emoji: '🛡️', titulo: 'Confere antes' },
  },
  passos: [
    pergunta(
      'sinais',
      'Qual destes é o maior sinal de golpe nessa conversa?',
      zapFalso(PEDIDO),
      [
        { id: 'oi', rotulo: 'Ele disse "Oi vó"' },
        { id: 'pix-urgente', rotulo: 'Pede um Pix urgente, de um número novo' },
        { id: 'beijo', rotulo: 'A mensagem é curtinha' },
      ],
      'pix-urgente',
      ['Pense no que a mensagem pede.', 'Dinheiro com pressa, vindo de um número que você não conhece: é o sinal de alerta.'],
      'Quase! O alerta é o pedido de dinheiro, com pressa, de um número novo.',
      'Pedido de dinheiro com pressa, de número novo, merece desconfiança.',
    ),
    pergunta(
      'conferir',
      'Como saber se é mesmo a sua neta?',
      zapFalso(PEDIDO),
      [
        { id: 'fazer-pix', rotulo: 'Faço o Pix logo, é urgente' },
        { id: 'ligar', rotulo: 'Ligo para o número antigo dela' },
        { id: 'responder', rotulo: 'Pergunto o nome do cachorro pelo mesmo número' },
      ],
      'ligar',
      ['Fale com ela por um jeito que você já conhece.', 'Ligue para o número que você já tinha guardado.'],
      'Quase! O mais seguro é ligar para o número antigo, que você já conhece.',
      'Ligue para o número antigo antes de qualquer Pix.',
    ),
    toque(
      'menu',
      'Não era ela. Toque nos três pontinhos ⋮ no alto para ver as opções.',
      zapFalso(PEDIDO),
      'menu',
      'Menu',
      'Os três pontinhos abrem as opções da conversa.',
      'São os três pontinhos, no canto de cima, à direita.',
    ),
    toque(
      'denunciar',
      'Toque em "Denunciar e bloquear", para ele não escrever mais.',
      zapFalso(PEDIDO, [
        {
          tipo: 'lista',
          itens: [
            { rotulo: 'Silenciar', icone: '🔕', id: 'silenciar' },
            { rotulo: 'Apenas bloquear', icone: '✋', id: 'bloquear' },
            { rotulo: 'Denunciar e bloquear', icone: '🚫', id: 'denunciar' },
          ],
        },
      ]),
      'denunciar',
      'Denunciar e bloquear',
      '"Silenciar" só esconde os avisos. Denunciar e bloquear avisa o aplicativo.',
      'É o último da lista, com o sinal de proibido.',
    ),
  ],
}

export const fasesMundo5: Fase[] = [w5Mensagens, w5Ligacao, w5Parente]
