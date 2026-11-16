import type { Fase, TelaApp, ZapConversa, ZapMensagem } from '../../core/engine/stepTypes'
import { ANEXAR, APP_ZAP, CAMERA, CAMPO, MICROFONE, MSG_ANA, VOLTAR, conversa, lista, type Barra } from '../zap'
import { digitar, pergunta, toque } from '../transporte/passos'

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
      'Escreva a sua resposta para a Ana, do jeito que quiser, e toque na setinha verde ➤ para enviar. Sugestão: Eu vou, Ana!',
      conversa(MSG_ANA, { escrevendo: true }),
      'Eu vou, Ana!',
      'Mensagem',
      'Enviar',
      'Escreva a resposta e depois toque na setinha verde para enviar.',
      { livre: true },
    ),
    toque(
      'voltar',
      'Mensagem enviada! Ela aparece no balão verde. Toque na seta ← no alto para voltar à lista de conversas.',
      conversa([...MSG_ANA, { de: 'eu', texto: '{digitado}', hora: '09:14', estado: 'lida' }], {
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
const anexos = (mensagens: ZapMensagem[] = [MSG_ANA[1]], nome = 'Ana'): TelaApp => ({
  zap: true,
  blocos: [
    {
      tipo: 'zapTopo',
      voltar: VOLTAR,
      titulo: nome,
      avatar: '👩',
      subtitulo: 'online',
      acoes: [{ rotulo: 'Ligar', icone: '📞', inerte: true }],
    },
    { tipo: 'zapChat', mensagens },
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
      'Escreva uma legenda para a foto, do jeito que quiser, e toque na setinha verde ➤ para enviar. Sugestão: Olha o bolo!',
      conversa([...MSG_ANA, { de: 'eu', foto: '🎂', hora: '09:20', estado: 'enviada' }], { escrevendo: true }),
      'Olha o bolo!',
      'Legenda',
      'Enviar',
      'A legenda é um textinho que vai junto da foto. Confira a foto antes de enviar: depois de enviada, ela não volta.',
      { livre: true },
    ),
    toque(
      'voltar',
      'Foto enviada com a sua legenda! Toque na seta ← para voltar à lista de conversas.',
      conversa([...MSG_ANA, { de: 'eu', foto: '🎂', texto: '{digitado}', hora: '09:20', estado: 'lida' }], {
        campo: CAMPO,
        anexar: { ...ANEXAR, inerte: true },
        camera: CAMERA,
        microfone: { ...MICROFONE, inerte: true, segurar: false },
      }),
      'voltar-lista',
      'Voltar',
      'A seta no alto, à esquerda, volta para a lista.',
      'É a seta ← no alto da tela, à esquerda do nome da Ana.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 2.3: enviar o arquivo certo
const CONVERSAS_ARQ: ZapConversa[] = [
  { id: 'conv-vizinha', nome: 'Ana Clara (vizinha do 12)', avatar: '👤', previa: 'Bom dia, dona! Tudo bem?', hora: '08:10' },
  { id: 'conv-ana', nome: 'Ana (neta)', avatar: '👩', previa: 'Vó, me manda o convite em PDF?', hora: '09:30', naoLidas: 1 },
  { id: 'conv-grupo', nome: 'Família Silva', avatar: '👪', previa: 'Tia Rosa: gente, olhem o convite!', hora: '08:50' },
  { id: 'conv-osvaldo', nome: 'Seu Osvaldo', avatar: '👴', previa: 'Bom dia, vizinha! 🌞', hora: 'Ontem', ticks: 'lida' },
]

const MSG_PDF: ZapMensagem[] = [
  { de: 'outro', texto: 'Vó, me manda o convite da festa em PDF? Quero imprimir.', hora: '09:30', dia: 'Hoje' },
]

const NOME_ARQ = 'Convite Ana FINAL.pdf'

const documentos = (): TelaApp => ({
  zap: true,
  blocos: [
    {
      tipo: 'zapTopo',
      voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-anexos' },
      titulo: 'Escolher documento',
      acoes: [{ rotulo: 'Buscar', icone: '🔍', inerte: true }],
    },
    {
      tipo: 'zapDocumentos',
      titulo: 'Documentos recentes',
      itens: [
        { rotulo: 'Convite Ana (rascunho).pdf', id: 'arq-rascunho', detalhe: 'Ontem, 21:15 · 98 KB' },
        { rotulo: NOME_ARQ, id: 'arq-final', detalhe: 'Hoje, 09:10 · 120 KB' },
        { rotulo: 'Convite Ana (antigo).pdf', id: 'arq-antigo', detalhe: 'Há 2 meses · 64 KB' },
        { rotulo: 'Receita do bolo.pdf', id: 'arq-receita', detalhe: 'Hoje, 08:30 · 40 KB' },
      ],
    },
  ],
})

export const w2Arquivo: Fase = {
  id: 'w2-arquivo',
  mundo: 2,
  titulo: 'Enviar o arquivo certo',
  simulador: 'mensagens',
  aplicativo: APP_ZAP,
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Dona {nome}, a Ana pediu o convite em PDF para imprimir.' },
      { quem: 'neuza', texto: 'Há versões parecidas no celular. Escolha a mais nova e mande só para a Ana.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Chegou o convite certinho, vó! Vou imprimir agora.' }],
    premio: { emoji: '📄', titulo: 'O convite certo' },
  },
  passos: [
    toque(
      'abrir',
      'Há duas Anas na lista. Abra a conversa da sua neta: "Ana (neta)".',
      lista(CONVERSAS_ARQ),
      'conv-ana',
      'Ana (neta)',
      'Dois contatos têm nomes parecidos. Leia o nome inteiro, com a explicação entre parênteses.',
      'É a segunda da lista, com a foto de uma moça e um recado novo.',
    ),
    toque(
      'clipe',
      'A Ana pediu o convite em PDF. Toque no clipe 📎 para anexar um arquivo.',
      conversa(
        MSG_PDF,
        { campo: CAMPO, anexar: ANEXAR, camera: CAMERA, microfone: { ...MICROFONE, inerte: true, segurar: false } },
        'Ana (neta)',
      ),
      'clipe',
      'Anexar',
      'O clipe serve para mandar coisas: foto, documento, áudio.',
      'É o clipe 📎, no lado direito da caixa de mensagem.',
    ),
    toque(
      'documento',
      'Um PDF é um documento. Toque em "Documento".',
      anexos(MSG_PDF, 'Ana (neta)'),
      'documento',
      'Documento',
      '"Galeria" é para fotos e vídeos. Para arquivos como PDF, use "Documento".',
      'É o primeiro botão, o roxo, com uma folha de papel.',
    ),
    toque(
      'qual-arquivo',
      'Há quatro arquivos. Toque na versão FINAL, a mais nova.',
      documentos(),
      'arq-final',
      NOME_ARQ,
      'Olhe a data embaixo de cada nome: a mais nova é a de hoje, às 09:10.',
      'O nome diz FINAL e a data é de hoje, às 09:10.',
    ),
    toque(
      'enviar',
      'Confira: arquivo FINAL, para a Ana (neta). Toque em "Enviar".',
      {
        zap: true,
        escurecida: true,
        blocos: [
          { tipo: 'zapTopo', voltar: VOLTAR, titulo: 'Ana (neta)', avatar: '👩', subtitulo: 'online' },
          { tipo: 'zapChat', mensagens: MSG_PDF },
          {
            tipo: 'zapDialogo',
            titulo: 'Enviar documento para Ana (neta)?',
            documento: NOME_ARQ,
            botoes: [
              { rotulo: 'Cancelar', id: 'cancelar-envio' },
              { rotulo: 'Enviar', id: 'enviar' },
            ],
          },
        ],
      },
      'enviar',
      'Enviar',
      'Antes de enviar, leia a pergunta: qual arquivo e para quem. Depois de enviado, não volta.',
      'É o botão verde "Enviar", no canto de baixo da caixa branca.',
    ),
    toque(
      'voltar',
      'Enviado! O convite aparece no balão verde. Toque na seta ← para voltar à lista.',
      conversa(
        [...MSG_PDF, { de: 'eu', documento: { nome: NOME_ARQ, info: 'PDF · 120 KB' }, hora: '09:34', estado: 'lida' }],
        { campo: CAMPO, anexar: { ...ANEXAR, inerte: true }, camera: CAMERA, microfone: { ...MICROFONE, inerte: true, segurar: false } },
        'Ana (neta)',
      ),
      'voltar-lista',
      'Voltar',
      'A seta no alto, à esquerda, volta para a lista.',
      'É a seta ← no alto da tela.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 2.4
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

export const fasesMundo2: Fase[] = [w2Responder, w2Foto, w2Arquivo, w2Audio]
