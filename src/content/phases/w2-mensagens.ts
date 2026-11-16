import type { AppTransporte, BlocoApp, Fase, TelaApp } from '../../core/engine/stepTypes'
import { digitar, pergunta, toque } from '../transporte/passos'

const APP_ZAP: AppTransporte = {
  id: 'zap',
  nome: 'WhatsApp',
  tema: { corPrincipal: '#0b6b57', corDestaque: '#0b6b57', link: '#0b6b57' },
  fonte:
    'Estrutura de tutoriais do WhatsApp (conversas, anexar, áudio). Ainda NÃO conferida em captura de tela real do grupo: conferir no app.',
}

const nav: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Conversas', icone: '💬', inerte: true },
    { rotulo: 'Atualizações', icone: '⭕', inerte: true },
    { rotulo: 'Chamadas', icone: '📞', inerte: true },
  ],
}

const lista = (): TelaApp => ({
  blocos: [
    {
      tipo: 'barra',
      titulo: 'WhatsApp',
      acoes: [
        { rotulo: 'Câmera', icone: '📷', inerte: true },
        { rotulo: 'Buscar', icone: '🔍', inerte: true },
      ],
    },
    {
      tipo: 'lista',
      itens: [
        { rotulo: 'Ana', id: 'conv-ana', icone: '👩', detalhe: 'Vó, você vem no meu aniversário? 🎂', etiqueta: '1' },
        { rotulo: 'Família Silva', id: 'conv-grupo', icone: '👪', detalhe: 'Tia Rosa: gente, olhem o convite!', etiqueta: '3' },
        { rotulo: 'Seu Osvaldo', id: 'conv-osvaldo', icone: '👴', detalhe: 'Bom dia, vizinha! 🌞' },
        { rotulo: '+55 21 9xxxx-0000', id: 'conv-desconhecido', icone: '👤', detalhe: 'Você ganhou um prêmio! Clique aqui' },
      ],
    },
    nav,
  ],
})

const conversa = (msgs: string[], extra: BlocoApp[] = [], voltarId = 'voltar-lista', titulo = 'Ana'): TelaApp => ({
  blocos: [
    {
      tipo: 'barra',
      voltar: { rotulo: 'Voltar', icone: '←', id: voltarId },
      titulo,
      acoes: [{ rotulo: 'Chamada de vídeo', icone: '🎥', inerte: true }],
    },
    ...msgs.map((texto): BlocoApp => ({ tipo: 'cartao', titulo: texto })),
    { tipo: 'espaco' },
    ...extra,
  ],
})

const caixaDeMensagem = (): BlocoApp => ({ tipo: 'pesquisa', item: { rotulo: 'Mensagem', icone: '✏️', id: 'campo-msg' } })

const MSG_ANA = ['Ana: Vó, o almoço é domingo, às 12h30, no Mercado Central.', 'Ana: Você vem? Responda quando puder 💛']

// ---------------------------------------------------------------- Fase 2.1
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
      'É a primeira da lista, com a foto de uma moça e o número 1 ao lado.',
    ),
    pergunta(
      'ler',
      'Leia as mensagens da Ana. A que horas é o almoço?',
      conversa(MSG_ANA),
      [
        { id: '12h', rotulo: 'Às 12h' },
        { id: '12h30', rotulo: 'Às 12h30' },
        { id: '13h30', rotulo: 'Às 13h30' },
      ],
      '12h30',
      ['Leia a primeira mensagem da Ana.', 'O horário está escrito logo depois de "domingo, às".'],
      'Quase! Releia a primeira mensagem: o horário está nela.',
      'Leia a mensagem inteira antes de responder.',
    ),
    toque(
      'campo',
      'Toque na caixa "Mensagem", no pé da tela, para escrever.',
      conversa(MSG_ANA, [caixaDeMensagem()]),
      'campo-msg',
      'Mensagem',
      'Para escrever, toque na caixa embaixo, onde está escrito "Mensagem".',
      'É a barra branca no pé da tela, com um lápis.',
    ),
    digitar(
      'escrever',
      'Escreva a resposta: Eu vou, Ana!',
      conversa(MSG_ANA, [{ tipo: 'campo', icone: '✏️' }]),
      'Eu vou, Ana!',
      'Mensagem',
      'Enviar',
      'Escreva a resposta e depois toque em Enviar.',
    ),
    toque(
      'enviar',
      'Sua mensagem está escrita. Toque em "Enviar" para mandar.',
      conversa(
        [...MSG_ANA, 'Você: Eu vou, Ana!'],
        [{ tipo: 'botao', item: { rotulo: 'Enviar', icone: '➤', id: 'enviar', principal: true } }],
      ),
      'enviar',
      'Enviar',
      'A mensagem só vai depois que você toca em Enviar.',
      'É o botão verde no pé da tela, com uma seta.',
    ),
    toque(
      'voltar',
      'Mensagem enviada! Toque na seta no alto para voltar à lista de conversas.',
      conversa([...MSG_ANA, 'Você: Eu vou, Ana! ✓✓']),
      'voltar-lista',
      'Voltar',
      'A seta no canto de cima, à esquerda, volta para a tela anterior.',
      'É a seta ← bem no alto, à esquerda do nome da Ana.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 2.2
const anexos = (): TelaApp => ({
  escurecida: true,
  blocos: [
    { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-lista' }, titulo: 'Ana' },
    { tipo: 'espaco' },
    {
      tipo: 'atalhos',
      titulo: 'Enviar',
      estilo: 'quadrados',
      itens: [
        { rotulo: 'Documento', icone: '📄', id: 'documento' },
        { rotulo: 'Câmera', icone: '📷', id: 'camera' },
        { rotulo: 'Galeria', icone: '🖼️', id: 'galeria' },
        { rotulo: 'Localização', icone: '📍', id: 'localizacao' },
        { rotulo: 'Contato', icone: '👤', id: 'contato' },
        { rotulo: 'Áudio', icone: '🎧', id: 'audio' },
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
      'Para mandar uma foto, toque no clipe 📎 ao lado da caixa de mensagem.',
      conversa(MSG_ANA, [
        {
          tipo: 'lista',
          itens: [
            { rotulo: 'Anexar', icone: '📎', id: 'clipe' },
            { rotulo: 'Mensagem', icone: '✏️', id: 'campo-msg' },
          ],
        },
      ]),
      'clipe',
      'Anexar',
      'Não é a caixa de escrever: é o botão do clipe, usado para anexar coisas.',
      'É o botão "Anexar", com um clipe, logo acima da caixa de mensagem.',
    ),
    toque(
      'galeria',
      'Escolha de onde vem a foto. O bolo já está no celular: toque em "Galeria".',
      anexos(),
      'galeria',
      'Galeria',
      'A "Câmera" tira uma foto nova. Como a foto já existe, use a Galeria.',
      'É o terceiro botão, com uma moldura de quadro.',
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
      conversa(['Foto: 🎂 Bolo de chocolate'], [{ tipo: 'campo', icone: '✏️' }]),
      'Olha o bolo!',
      'Legenda',
      'Enviar',
      'A legenda é um textinho que vai junto da foto.',
    ),
    toque(
      'enviar',
      'Confira se é mesmo a foto do bolo e toque em "Enviar".',
      conversa(
        ['Foto: 🎂 Bolo de chocolate', 'Legenda: Olha o bolo!'],
        [{ tipo: 'botao', item: { rotulo: 'Enviar', icone: '➤', id: 'enviar', principal: true } }],
      ),
      'enviar',
      'Enviar',
      'Depois de enviada, a foto não volta. Confira antes.',
      'É o botão verde no pé da tela.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 2.3
const grupo = (extra: BlocoApp[] = []): TelaApp =>
  conversa(
    [
      'Tia Rosa: Gente, o almoço da Ana é domingo, às 12h30!',
      'Tio Beto: Eu levo os refrigerantes.',
      'Tia Rosa: Quem precisa de carona, avise aqui.',
    ],
    extra,
    'voltar-lista',
    'Família Silva',
  )

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
      'É a segunda da lista, com três mensagens novas.',
    ),
    pergunta(
      'ler',
      'Leia o grupo. Quem vai levar os refrigerantes?',
      grupo(),
      [
        { id: 'rosa', rotulo: 'Tia Rosa' },
        { id: 'beto', rotulo: 'Tio Beto' },
        { id: 'ana', rotulo: 'Ana' },
      ],
      'beto',
      ['Leia as três mensagens do grupo.', 'A segunda mensagem fala dos refrigerantes.'],
      'Quase! Procure a mensagem que fala dos refrigerantes.',
      'Em grupo há muitas pessoas: confira quem escreveu cada mensagem.',
    ),
    toque(
      'gravar',
      'Para falar em vez de escrever, toque no microfone 🎤.',
      grupo([
        {
          tipo: 'lista',
          itens: [
            { rotulo: 'Mensagem', icone: '✏️', id: 'campo-msg' },
            { rotulo: 'Gravar áudio', icone: '🎤', id: 'microfone' },
          ],
        },
      ]),
      'microfone',
      'Gravar áudio',
      'O microfone grava a sua voz. A caixa de mensagem serve para escrever.',
      'É o botão "Gravar áudio", com um microfone.',
    ),
    toque(
      'enviar-audio',
      'Está gravando! Fale: "Eu preciso de carona". Depois toque em "Enviar áudio".',
      grupo([
        { tipo: 'cartao', titulo: '🔴 Gravando… 0:04', texto: 'Fale perto do celular.' },
        {
          tipo: 'lista',
          itens: [
            { rotulo: 'Apagar o áudio', icone: '🗑️', id: 'apagar' },
            { rotulo: 'Enviar áudio', icone: '➤', id: 'enviar-audio' },
          ],
        },
      ]),
      'enviar-audio',
      'Enviar áudio',
      'A lixeira apaga o que você gravou. Para mandar, use a seta.',
      'É o botão com a seta ➤, embaixo.',
    ),
    toque(
      'voltar',
      'Áudio enviado! Volte para a lista de conversas.',
      grupo([{ tipo: 'cartao', titulo: 'Você: 🎧 Áudio 0:04 ✓✓' }]),
      'voltar-lista',
      'Voltar',
      'A seta no alto, à esquerda, volta para a lista.',
      'É a seta ← no alto da tela.',
    ),
  ],
}

export const fasesMundo2: Fase[] = [w2Responder, w2Foto, w2Audio]
