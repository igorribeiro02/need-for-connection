import type { AppTransporte, BlocoApp, Fase, TelaApp, ZapConversa, ZapMensagem } from '../../core/engine/stepTypes'
import { ANEXAR, APP_ZAP, CAMERA, CAMPO, MICROFONE, VOLTAR, lista } from '../zap'
import { pergunta, toque } from '../transporte/passos'

const APP_MSG: AppTransporte = {
  id: 'mensagens',
  nome: 'Mensagens',
  tema: { corPrincipal: '#1b4b8f', corDestaque: '#1b4b8f', link: '#1b4b8f' },
  fonte:
    'Mensagens de golpe inventadas a partir de modelos que circulam (falso banco, falso prêmio, falso parente). Nenhum número, link ou nome é real.',
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
  mundo: 4,
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

// ---------------------------------------------------------------- Fase 5.3: falso parente (conversa do WhatsApp)
const DESCONHECIDO = '+55 21 9xxxx-0000'

const CONVERSAS_NOVAS: ZapConversa[] = [
  {
    id: 'conv-desconhecido',
    nome: DESCONHECIDO,
    avatar: '👤',
    previa: 'Preciso pagar uma conta urgente. Pode fazer um Pix…',
    hora: '10:03',
    naoLidas: 2,
  },
  { id: 'conv-ana', nome: 'Ana', avatar: '👩', previa: 'Vó, você vem no meu aniversário? 🎂', hora: '09:12' },
  { id: 'conv-grupo', nome: 'Família Silva', avatar: '👪', previa: 'Tia Rosa: gente, olhem o convite!', hora: '08:50' },
  { id: 'conv-osvaldo', nome: 'Seu Osvaldo', avatar: '👴', previa: 'Bom dia, vizinha! 🌞', hora: 'Ontem', ticks: 'lida' },
]

const MSGS_FALSO: ZapMensagem[] = [
  { de: 'outro', texto: 'Oi vó! Troquei de número, salva este.', hora: '10:02', dia: 'Hoje' },
  { de: 'outro', texto: 'Preciso pagar uma conta urgente. Pode fazer um Pix de R$ 800 agora? Depois explico!', hora: '10:03' },
]

const falso = (antes: BlocoApp[] = [], escurecida = false): TelaApp => ({
  zap: true,
  escurecida,
  blocos: [
    {
      tipo: 'zapTopo',
      voltar: VOLTAR,
      titulo: DESCONHECIDO,
      avatar: '👤',
      subtitulo: 'toque para ver os dados',
      acoes: [{ rotulo: 'Mais opções', icone: '⋮', id: 'menu' }],
    },
    ...antes,
    {
      tipo: 'zapChat',
      mensagens: MSGS_FALSO,
      aviso: {
        texto: 'Este número não está na sua lista de contatos.',
        acoes: [
          { rotulo: 'Bloquear', inerte: true },
          { rotulo: 'Adicionar', inerte: true },
        ],
      },
      campo: CAMPO,
      anexar: { ...ANEXAR, inerte: true },
      camera: CAMERA,
      microfone: { ...MICROFONE, inerte: true, segurar: false },
    },
  ],
})

export const w5Parente: Fase = {
  id: 'w5-parente',
  mundo: 4,
  titulo: 'Oi, vó! Mudei de número',
  simulador: 'mensagens',
  aplicativo: APP_ZAP,
  historia: {
    abertura: [
      { quem: 'sorrateiro', texto: 'Oi, vovó! Sou eu, seu netinho... mande um Pix, vai?' },
      { quem: 'neuza', texto: 'Parece a Ana, mas o número é novo. Vamos conferir antes de qualquer coisa.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Vó, esse número não era o meu! Ainda bem que você desconfiou.' }],
    premio: { emoji: '🛡️', titulo: 'Confere antes' },
  },
  passos: [
    toque(
      'abrir',
      'Chegou uma mensagem de um número novo. Abra essa conversa.',
      lista(CONVERSAS_NOVAS),
      'conv-desconhecido',
      DESCONHECIDO,
      'Número que não está na sua lista de contatos pede cuidado.',
      'É a primeira da lista, com o número em vez de um nome, e dois recados novos.',
    ),
    pergunta(
      'sinais',
      'Qual destes é o maior sinal de golpe nessa conversa?',
      falso(),
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
      falso(),
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
      falso(),
      'menu',
      'Mais opções',
      'Os três pontinhos abrem as opções da conversa.',
      'São os três pontinhos, no canto de cima, à direita, na barra verde.',
    ),
    toque(
      'mais',
      'Toque em "Mais" para ver outras opções.',
      falso([
        {
          tipo: 'zapMenu',
          itens: [
            { rotulo: 'Ver contato', inerte: true },
            { rotulo: 'Buscar', inerte: true },
            { rotulo: 'Silenciar notificações', inerte: true },
            { rotulo: 'Mais', id: 'mais' },
          ],
        },
      ]),
      'mais',
      'Mais',
      '"Denunciar" fica escondido dentro de "Mais".',
      'É a última linha do menu branco.',
    ),
    toque(
      'denunciar',
      'Toque em "Denunciar", para avisar o WhatsApp sobre esse golpe.',
      falso([
        {
          tipo: 'zapMenu',
          itens: [
            { rotulo: 'Denunciar', id: 'denunciar' },
            { rotulo: 'Bloquear', id: 'so-bloquear' },
            { rotulo: 'Limpar conversa', id: 'limpar' },
            { rotulo: 'Exportar conversa', inerte: true },
          ],
        },
      ]),
      'denunciar',
      'Denunciar',
      '"Bloquear" sozinho impede novas mensagens, mas não avisa o WhatsApp. "Denunciar" faz as duas coisas.',
      'É a primeira linha do menu branco.',
    ),
    toque(
      'confirmar-denuncia',
      'O WhatsApp pergunta se você quer mesmo denunciar. A caixa já vem marcada para bloquear. Toque em "Denunciar".',
      falso(
        [
          {
            tipo: 'zapDialogo',
            titulo: 'Denunciar este contato?',
            texto: 'As últimas mensagens dele serão enviadas ao WhatsApp. Ele não vai saber que foi você.',
            marcado: 'Bloquear contato e apagar mensagens desta conversa',
            botoes: [
              { rotulo: 'Cancelar', id: 'cancelar-denuncia' },
              { rotulo: 'Denunciar', id: 'confirmar-denuncia' },
            ],
          },
        ],
        true,
      ),
      'confirmar-denuncia',
      'Denunciar',
      'Denunciar e bloquear é a forma de impedir que o golpista tente de novo.',
      'É o botão verde escrito "Denunciar", no canto de baixo da caixa branca.',
    ),
  ],
}

export const fasesMundo5: Fase[] = [w5Ligacao, w5Parente]
