import type { AppTransporte, BlocoApp, Fase, ItemApp, TelaApp, ZapConversa, ZapMensagem } from '../../core/engine/stepTypes'
import { digitar, pergunta, toque } from '../transporte/passos'

// Interface copiada do WhatsApp (barra verde, balões, barra de mensagem redonda, microfone que se segura).
const APP_ZAP: AppTransporte = {
  id: 'zap',
  nome: 'WhatsApp',
  tema: { corPrincipal: '#008069', corDestaque: '#00a884', link: '#008069' },
  fonte:
    'Layout do WhatsApp (lista de conversas, balões, anexos e microfone de segurar) reproduzido de capturas e tutoriais oficiais. Conferir no app do grupo.',
}

const nav: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Conversas', icone: '💬', inerte: true },
    { rotulo: 'Atualizações', icone: '⭕', inerte: true },
    { rotulo: 'Comunidades', icone: '👥', inerte: true },
    { rotulo: 'Chamadas', icone: '📞', inerte: true },
  ],
}

const CONVERSAS: ZapConversa[] = [
  { id: 'conv-ana', nome: 'Ana', avatar: '👩', previa: 'Vó, você vem no meu aniversário? 🎂', hora: '09:12', naoLidas: 1 },
  { id: 'conv-grupo', nome: 'Família Silva', avatar: '👪', previa: 'Tia Rosa: gente, olhem o convite!', hora: '08:50', naoLidas: 3 },
  { id: 'conv-osvaldo', nome: 'Seu Osvaldo', avatar: '👴', previa: 'Bom dia, vizinha! 🌞', hora: 'Ontem', ticks: 'lida' },
  { id: 'conv-desconhecido', nome: '+55 21 9xxxx-0000', avatar: '👤', previa: 'Você ganhou um prêmio! Clique aqui', hora: 'Ontem' },
]

const lista = (): TelaApp => ({
  zap: true,
  blocos: [
    {
      tipo: 'zapTopo',
      titulo: 'WhatsApp',
      acoes: [
        { rotulo: 'Câmera', icone: '📷', inerte: true },
        { rotulo: 'Buscar', icone: '🔍', inerte: true },
        { rotulo: 'Mais opções', icone: '⋮', inerte: true },
      ],
    },
    {
      tipo: 'zapConversas',
      filtros: ['Todas', 'Não lidas', 'Favoritas', 'Grupos'],
      itens: CONVERSAS,
      novo: { rotulo: 'Nova conversa', icone: '➕', inerte: true },
    },
    nav,
  ],
})

const VOLTAR: ItemApp = { rotulo: 'Voltar', icone: '←', id: 'voltar-lista' }

type Barra = {
  campo?: ItemApp
  anexar?: ItemApp
  camera?: ItemApp
  microfone?: ItemApp
  enviar?: ItemApp
  escrevendo?: boolean
  texto?: string
}

const conversa = (mensagens: ZapMensagem[], barra: Barra = {}, nome = 'Ana', avatar = '👩', subtitulo = 'online'): TelaApp => ({
  zap: true,
  blocos: [
    {
      tipo: 'zapTopo',
      voltar: VOLTAR,
      titulo: nome,
      avatar,
      subtitulo,
      acoes: [{ rotulo: 'Ligar', icone: '📞', inerte: true }],
    },
    { tipo: 'zapChat', mensagens, ...barra },
  ],
})

const CAMPO: ItemApp = { rotulo: 'Mensagem', id: 'campo-msg' }
const ANEXAR: ItemApp = { rotulo: 'Anexar', id: 'clipe' }
const CAMERA: ItemApp = { rotulo: 'Câmera', id: 'camera-chat', inerte: true }
const MICROFONE: ItemApp = { rotulo: 'Gravar áudio', id: 'microfone', segurar: true }
const ENVIAR: ItemApp = { rotulo: 'Enviar', id: 'enviar', principal: true }

const MSG_ANA: ZapMensagem[] = [
  { de: 'outro', texto: 'Vó, o almoço é domingo, às 12h30, no Mercado Central.', hora: '09:10', dia: 'Hoje' },
  { de: 'outro', texto: 'Você vem? Responda quando puder 💛', hora: '09:12' },
]

export const w2Responder: Fase = {
  id: 'w2-responder',
  mundo: 2,
  titulo: 'Ler e responder a Ana',
  simulador: 'mensagens',
  aplicativo: APP_ZAP,
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'Seu celular apitou, {nome}! É a Ana.' },
      { quem: 'neuza', texto: 'Abra a conversa, leia com calma e responda a ela.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Oba! Recebi a sua resposta, vó. Já guardei o seu lugar na mesa.' }],
    premio: { emoji: '💬', titulo: 'A primeira resposta' },
  },
  passos: [
    toque(
      'abrir',
      'Há quatro conversas. Abra a da Ana, a sua neta.',
      lista(),
      'conv-ana',
      'Ana',
      'Cuidado com o número desconhecido: conversa de quem você não conhece pode ser golpe.',
      'É a primeira da lista, com a foto de uma moça e o número 1 em verde ao lado.',
    ),
    pergunta(
      'ler',
      'Leia as mensagens da Ana. A que horas é o almoço?',
      conversa(MSG_ANA, { campo: CAMPO, anexar: ANEXAR, camera: CAMERA, microfone: { ...MICROFONE, inerte: true, segurar: false } }),
      [
        { id: '12h', rotulo: 'Às 12h' },
        { id: '12h30', rotulo: 'Às 12h30' },
        { id: '13h30', rotulo: 'Às 13h30' },
      ],
      '12h30',
      ['Leia a primeira mensagem da Ana, no balão branco.', 'O horário está escrito logo depois de "domingo, às".'],
      'Quase! Releia a primeira mensagem: o horário está nela.',
      'Leia a mensagem inteira antes de responder.',
    ),
    toque(
      'campo',
      'Toque na caixa "Mensagem", no pé da tela, para escrever.',
      conversa(MSG_ANA, { campo: CAMPO, anexar: ANEXAR, camera: CAMERA, microfone: { ...MICROFONE, inerte: true, segurar: false } }),
      'campo-msg',
      'Mensagem',
      'Para escrever, toque na caixa branca embaixo, onde está escrito "Mensagem".',
      'É a barra branca redonda no pé da tela.',
    ),
    digitar(
      'escrever',
      'Escreva a resposta: Eu vou, Ana!',
      conversa(MSG_ANA, { escrevendo: true }),
      'Eu vou, Ana!',
      'Mensagem',
      'Enviar',
      'Escreva a resposta e depois toque na setinha verde para enviar.',
    ),
    toque(
      'enviar',
      'Sua mensagem está escrita. Toque na setinha verde ➤ para mandar.',
      conversa(MSG_ANA, { campo: CAMPO, texto: 'Eu vou, Ana!', anexar: { ...ANEXAR, inerte: true }, enviar: ENVIAR }),
      'enviar',
      'Enviar',
      'A mensagem só vai depois que você toca na seta verde.',
      'É o botão redondo verde, no canto de baixo, à direita.',
    ),
    toque(
      'voltar',
      'Mensagem enviada! Toque na seta ← no alto para voltar à lista de conversas.',
      conversa([...MSG_ANA, { de: 'eu', texto: 'Eu vou, Ana!', hora: '09:14', estado: 'lida' }], {
        campo: CAMPO,
        anexar: { ...ANEXAR, inerte: true },
        camera: CAMERA,
        microfone: { ...MICROFONE, inerte: true, segurar: false },
      }),
      'voltar-lista',
      'Voltar',
      'A seta no canto de cima, à esquerda, volta para a tela anterior.',
      'É a seta ← bem no alto, à esquerda do nome da Ana. Os dois tracinhos azuis ✓✓ mostram que ela leu.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 2.2
const anexos = (): TelaApp => ({
  zap: true,
  blocos: [
    {
      tipo: 'zapTopo',
      voltar: VOLTAR,
      titulo: 'Ana',
      avatar: '👩',
      subtitulo: 'online',
      acoes: [{ rotulo: 'Ligar', icone: '📞', inerte: true }],
    },
    { tipo: 'zapChat', mensagens: [MSG_ANA[1]] },
    {
      tipo: 'zapAnexos',
      itens: [
        { rotulo: 'Documento', icone: '📄', id: 'documento' },
        { rotulo: 'Câmera', icone: '📷', id: 'camera' },
        { rotulo: 'Galeria', icone: '🖼️', id: 'galeria' },
        { rotulo: 'Áudio', icone: '🎧', id: 'audio' },
        { rotulo: 'Localização', icone: '📍', id: 'localizacao' },
        { rotulo: 'Contato', icone: '👤', id: 'contato' },
      ],
    },
  ],
})

const galeria = (): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-anexos' }, titulo: 'Galeria' },
    {
      tipo: 'atalhos',
      titulo: 'Recentes',
      estilo: 'caixas',
      itens: [
        { rotulo: 'Cachorro no parque', icone: '🐶', id: 'foto-cachorro', detalhe: 'Ontem' },
        { rotulo: 'Bolo de chocolate', icone: '🎂', id: 'foto-bolo', detalhe: 'Hoje, 08:42' },
        { rotulo: 'Receita anotada', icone: '📝', id: 'foto-receita', detalhe: 'Hoje, 08:40' },
        { rotulo: 'Pôr do sol', icone: '🌅', id: 'foto-por-do-sol', detalhe: 'Semana passada' },
      ],
    },
  ],
})

export const w2Foto: Fase = {
  id: 'w2-foto',
  mundo: 2,
  titulo: 'Mandar a foto do bolo',
  simulador: 'mensagens',
  aplicativo: APP_ZAP,
  historia: {
    abertura: [
      { quem: 'ana', texto: 'Vó, vou fazer um bolo para a festa! Qual sabor combina mais com você?' },
      { quem: 'neuza', texto: 'Você tirou uma foto do bolo hoje cedo. Mande para a Ana.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Que bolo lindo, vó! Vai ser esse mesmo.' }],
    premio: { emoji: '🎂', titulo: 'O bolo perfeito' },
  },
  passos: [
    toque('abrir', 'Abra a conversa da Ana.', lista(), 'conv-ana', 'Ana', 'Procure o nome da Ana na lista.', 'É a primeira da lista.'),
    toque(
      'clipe',
      'Para mandar uma foto, toque no clipe 📎 dentro da caixa de mensagem.',
      conversa(MSG_ANA, { campo: CAMPO, anexar: ANEXAR, camera: CAMERA, microfone: { ...MICROFONE, inerte: true, segurar: false } }),
      'clipe',
      'Anexar',
      'Não é a caixa de escrever: é o clipe, usado para anexar coisas.',
      'É o clipe 📎, no lado direito da caixa de mensagem, ao lado da câmera.',
    ),
    toque(
      'galeria',
      'Escolha de onde vem a foto. O bolo já está no celular: toque em "Galeria".',
      anexos(),
      'galeria',
      'Galeria',
      'A "Câmera" tira uma foto nova. Como a foto já existe, use a Galeria.',
      'É o botão roxo com uma moldura de quadro, na primeira fileira.',
    ),
    toque(
      'qual-foto',
      'Toque na foto do bolo.',
      galeria(),
      'foto-bolo',
      'Bolo de chocolate',
      'Confira a foto antes de enviar: fotos erradas já foram parar na pessoa errada.',
      'Procure a foto de hoje, com um bolo: "Bolo de chocolate".',
    ),
    digitar(
      'legenda',
      'Escreva uma legenda: Olha o bolo!',
      conversa([...MSG_ANA, { de: 'eu', foto: '🎂', hora: '09:20', estado: 'enviada' }], { escrevendo: true }),
      'Olha o bolo!',
      'Legenda',
      'Enviar',
      'A legenda é um textinho que vai junto da foto.',
    ),
    toque(
      'enviar',
      'Confira se é mesmo a foto do bolo e toque na setinha verde ➤ para enviar.',
      conversa([...MSG_ANA, { de: 'eu', foto: '🎂', texto: 'Olha o bolo!', hora: '09:20', estado: 'enviada' }], {
        campo: CAMPO,
        texto: 'Olha o bolo!',
        enviar: ENVIAR,
      }),
      'enviar',
      'Enviar',
      'Depois de enviada, a foto não volta. Confira antes.',
      'É o botão redondo verde, no canto de baixo, à direita.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 2.3
const GRUPO: ZapMensagem[] = [
  { de: 'outro', autor: 'Tia Rosa', texto: 'Gente, o almoço da Ana é domingo, às 12h30!', hora: '08:44', dia: 'Hoje' },
  { de: 'outro', autor: 'Tio Beto', texto: 'Eu levo os refrigerantes.', hora: '08:47' },
  { de: 'outro', autor: 'Tia Rosa', texto: 'Quem precisa de carona, avise aqui.', hora: '08:50' },
]

const grupo = (mensagens: ZapMensagem[] = GRUPO, barra: Barra = {}): TelaApp =>
  conversa(mensagens, barra, 'Família Silva', '👪', 'toque para ver os membros')

export const w2Audio: Fase = {
  id: 'w2-audio',
  mundo: 2,
  titulo: 'Mandar um áudio no grupo',
  simulador: 'mensagens',
  aplicativo: APP_ZAP,
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Dona {nome}, escrever cansa a vista! Eu mando áudio, é bem mais fácil.' },
      { quem: 'neuza', texto: 'A Tia Rosa perguntou quem precisa de carona. Responda por áudio no grupo.' },
    ],
    fechamento: [{ quem: 'osvaldo', texto: 'Viu só? Falou, enviou, pronto. A família toda ouviu.' }],
    premio: { emoji: '🎙️', titulo: 'A voz da vovó' },
  },
  passos: [
    toque(
      'abrir',
      'Abra o grupo da família: "Família Silva".',
      lista(),
      'conv-grupo',
      'Família Silva',
      'Um grupo tem vários nomes de pessoas. O nome do grupo aparece na lista.',
      'É a segunda da lista, com o número 3 em verde.',
    ),
    pergunta(
      'ler',
      'Leia o grupo. Quem vai levar os refrigerantes?',
      grupo(GRUPO, {
        campo: CAMPO,
        anexar: { ...ANEXAR, inerte: true },
        camera: CAMERA,
        microfone: { ...MICROFONE, inerte: true, segurar: false },
      }),
      [
        { id: 'rosa', rotulo: 'Tia Rosa' },
        { id: 'beto', rotulo: 'Tio Beto' },
        { id: 'ana', rotulo: 'Ana' },
      ],
      'beto',
      ['Leia as três mensagens do grupo.', 'A segunda mensagem fala dos refrigerantes.'],
      'Quase! Procure a mensagem que fala dos refrigerantes.',
      'Em grupo há muitas pessoas: o nome de quem escreveu aparece em laranja em cima de cada balão.',
    ),
    toque(
      'gravar',
      'Para falar em vez de escrever, SEGURE o dedo no microfone 🎤 (o botão verde redondo), fale "Eu preciso de carona" e depois SOLTE.',
      grupo(GRUPO, { campo: CAMPO, anexar: { ...ANEXAR, inerte: true }, camera: CAMERA, microfone: MICROFONE }),
      'microfone',
      'Gravar áudio',
      'No WhatsApp o áudio só grava enquanto o dedo está apertando o microfone. Ao soltar, ele é enviado sozinho. Se tiver dificuldade, use "Me mostre onde tocar": nesse modo basta um toque.',
      'É o botão redondo verde no canto de baixo, à direita, com um microfone. Mantenha o dedo apertado por uns 2 segundos.',
    ),
    toque(
      'voltar',
      'Áudio enviado! Ele aparece como um balão verde com uma onda. Toque na seta ← para voltar à lista.',
      grupo([...GRUPO, { de: 'eu', audio: '0:04', hora: '08:53', estado: 'lida' }], {
        campo: CAMPO,
        anexar: { ...ANEXAR, inerte: true },
        camera: CAMERA,
        microfone: { ...MICROFONE, inerte: true, segurar: false },
      }),
      'voltar-lista',
      'Voltar',
      'A seta no alto, à esquerda, volta para a lista.',
      'É a seta ← no alto da tela, à esquerda do nome do grupo.',
    ),
  ],
}

export const fasesMundo2: Fase[] = [w2Responder, w2Foto, w2Audio]
