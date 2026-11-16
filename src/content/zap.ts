import type { AppTransporte, BlocoApp, ItemApp, TelaApp, ZapConversa, ZapMensagem } from '../core/engine/stepTypes'

// Interface copiada do WhatsApp (barra verde, balões, barra de mensagem redonda, microfone que se segura).
export const APP_ZAP: AppTransporte = {
  id: 'zap',
  nome: 'WhatsApp',
  tema: { corPrincipal: '#008069', corDestaque: '#00a884', link: '#008069' },
  fonte:
    'Layout do WhatsApp (lista de conversas, balões, anexos e microfone de segurar) reproduzido de capturas e tutoriais oficiais. Conferir no app do grupo.',
}

export const nav: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Conversas', icone: '💬', inerte: true },
    { rotulo: 'Atualizações', icone: '⭕', inerte: true },
    { rotulo: 'Comunidades', icone: '👥', inerte: true },
    { rotulo: 'Chamadas', icone: '📞', inerte: true },
  ],
}

export const CONVERSAS: ZapConversa[] = [
  { id: 'conv-ana', nome: 'Ana', avatar: '👩', previa: 'Vó, você vem no meu aniversário? 🎂', hora: '09:12', naoLidas: 1 },
  { id: 'conv-grupo', nome: 'Família Silva', avatar: '👪', previa: 'Tia Rosa: gente, olhem o convite!', hora: '08:50', naoLidas: 3 },
  { id: 'conv-osvaldo', nome: 'Seu Osvaldo', avatar: '👴', previa: 'Bom dia, vizinha! 🌞', hora: 'Ontem', ticks: 'lida' },
  { id: 'conv-desconhecido', nome: '+55 21 9xxxx-0000', avatar: '👤', previa: 'Você ganhou um prêmio! Clique aqui', hora: 'Ontem' },
]

export const lista = (conversas: ZapConversa[] = CONVERSAS): TelaApp => ({
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
      itens: conversas,
      novo: { rotulo: 'Nova conversa', icone: '➕', inerte: true },
    },
    nav,
  ],
})

export const VOLTAR: ItemApp = { rotulo: 'Voltar', icone: '←', id: 'voltar-lista' }

export type Barra = {
  campo?: ItemApp
  anexar?: ItemApp
  camera?: ItemApp
  microfone?: ItemApp
  enviar?: ItemApp
  escrevendo?: boolean
  texto?: string
}

export const conversa = (mensagens: ZapMensagem[], barra: Barra = {}, nome = 'Ana', avatar = '👩', subtitulo = 'online'): TelaApp => ({
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

export const CAMPO: ItemApp = { rotulo: 'Mensagem', id: 'campo-msg' }
export const ANEXAR: ItemApp = { rotulo: 'Anexar', id: 'clipe' }
export const CAMERA: ItemApp = { rotulo: 'Câmera', id: 'camera-chat', inerte: true }
export const MICROFONE: ItemApp = { rotulo: 'Gravar áudio', id: 'microfone', segurar: true }

export const MSG_ANA: ZapMensagem[] = [
  { de: 'outro', texto: 'Vó, o almoço é domingo, às 12h30, no Mercado Central.', hora: '09:10', dia: 'Hoje' },
  { de: 'outro', texto: 'Você vem? Responda quando puder 💛', hora: '09:12' },
]

