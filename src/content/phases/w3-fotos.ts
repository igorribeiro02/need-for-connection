import type { AppTransporte, BlocoApp, Fase, TelaApp } from '../../core/engine/stepTypes'
import { pergunta, toque } from '../transporte/passos'

const APP_FOTOS: AppTransporte = {
  id: 'fotos',
  nome: 'Câmera e Galeria',
  tema: { corPrincipal: '#1b4b8f', corDestaque: '#1b4b8f', link: '#1b4b8f' },
  fonte: 'Estrutura geral de câmera e galeria de celulares Android. Os nomes dos botões variam de marca: conferir no celular do grupo.',
}

// ---------------------------------------------------------------- Fase 3.1: tirar a foto
const camera = (modo: 'video' | 'foto', salva = false): TelaApp => ({
  escuro: true,
  blocos: [
    {
      tipo: 'barra',
      titulo: salva ? 'Foto salva ✓' : 'Câmera',
      acoes: [
        { rotulo: 'Flash', icone: '⚡', id: 'flash' },
        { rotulo: 'Girar a câmera', icone: '🔄', id: 'girar' },
      ],
    },
    {
      tipo: 'cartao',
      titulo: modo === 'video' ? '🎬 Gravando vídeo' : '🎂 Bolo na mesa',
      texto: modo === 'video' ? 'Neste modo a câmera grava filme, não tira foto.' : 'Enquadre o bolo no meio da tela.',
    },
    {
      tipo: 'fichas',
      ativa: modo === 'video' ? 0 : 1,
      itens: [
        { rotulo: 'Vídeo', id: 'modo-video' },
        { rotulo: 'Foto', id: 'modo-foto' },
      ],
    },
    ...(salva
      ? ([{ tipo: 'botao', item: { rotulo: 'Ver a foto que tirei', icone: '🖼️', id: 'miniatura', principal: true } }] as BlocoApp[])
      : ([
          {
            tipo: 'botao',
            item: {
              rotulo: modo === 'video' ? 'Gravar vídeo' : 'Tirar a foto',
              icone: '⚪',
              id: modo === 'video' ? 'gravar' : 'disparar',
              principal: true,
            },
          },
        ] as BlocoApp[])),
  ],
})

export const w3TirarFoto: Fase = {
  id: 'w3-tirar-foto',
  mundo: 3,
  titulo: 'Tirar a foto do bolo',
  simulador: 'arquivos',
  aplicativo: APP_FOTOS,
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'O bolo do seu presente ficou pronto, {nome}!' },
      { quem: 'neuza', texto: 'Vamos tirar uma foto bonita para guardar. Abra a câmera e tire.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Ficou linda! Agora a lembrança está guardada na galeria.' }],
    premio: { emoji: '📸', titulo: 'A foto do bolo' },
  },
  passos: [
    toque(
      'modo-foto',
      'A câmera abriu em "Vídeo". Para tirar foto, toque em "Foto".',
      camera('video'),
      'modo-foto',
      'Foto',
      'Os modos ficam perto do botão grande. "Vídeo" grava filme; "Foto" tira fotografia.',
      'É a palavra "Foto", ao lado de "Vídeo", logo acima do botão grande.',
    ),
    pergunta(
      'enquadrar',
      'Antes de tirar: o bolo está inteiro na tela?',
      camera('foto'),
      [
        { id: 'sim', rotulo: 'Sim, está no meio da tela' },
        { id: 'nao', rotulo: 'Não, está cortado' },
      ],
      'sim',
      ['Olhe o desenho do bolo no meio da tela.', 'O bolo está bem no centro.'],
      'Olhe de novo: o bolo está no meio, inteiro.',
      'Confira o enquadramento antes de tirar a foto.',
    ),
    toque(
      'disparar',
      'Toque no botão grande "Tirar a foto".',
      camera('foto'),
      'disparar',
      'Tirar a foto',
      'O botão redondo grande, no pé da tela, tira a foto.',
      'É o botão azul grande, embaixo.',
    ),
    toque(
      'miniatura',
      'Foto tirada! Toque em "Ver a foto que tirei".',
      camera('foto', true),
      'miniatura',
      'Ver a foto que tirei',
      'A foto recém-tirada aparece num botão pequeno, para você conferir.',
      'É o botão azul embaixo, com uma moldura de quadro.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 3.2: editar
const foto = (blocos: BlocoApp[], titulo = 'Foto'): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-galeria' }, titulo },
    { tipo: 'cartao', titulo: '🎂 Bolo na mesa', texto: 'Tirada hoje' },
    { tipo: 'espaco' },
    ...blocos,
  ],
})

export const w3Editar: Fase = {
  id: 'w3-editar',
  mundo: 3,
  titulo: 'Cortar e salvar uma cópia',
  simulador: 'arquivos',
  aplicativo: APP_FOTOS,
  historia: {
    abertura: [
      { quem: 'ana', texto: 'Vó, manda o bolo quadradinho para eu pôr no convite?' },
      { quem: 'neuza', texto: 'Vamos cortar a foto em formato quadrado, sem perder a original.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Perfeito, vó! Coube direitinho no convite.' }],
    premio: { emoji: '✂️', titulo: 'Foto sob medida' },
  },
  passos: [
    toque(
      'editar',
      'Esta é a foto do bolo. Toque em "Editar".',
      foto([
        {
          tipo: 'lista',
          itens: [
            { rotulo: 'Compartilhar', icone: '📤', id: 'compartilhar' },
            { rotulo: 'Editar', icone: '✏️', id: 'editar' },
            { rotulo: 'Excluir', icone: '🗑️', id: 'excluir' },
          ],
        },
      ]),
      'editar',
      'Editar',
      'Ao pé da foto há três botões. "Excluir" apagaria a foto: cuidado.',
      'É o botão do meio, com um lápis.',
    ),
    toque(
      'cortar',
      'Na lista de ferramentas, toque em "Cortar".',
      foto(
        [
          {
            tipo: 'lista',
            itens: [
              { rotulo: 'Brilho', icone: '☀️', id: 'brilho' },
              { rotulo: 'Filtros', icone: '🎨', id: 'filtros' },
              { rotulo: 'Cortar', icone: '✂️', id: 'cortar' },
            ],
          },
        ],
        'Editar',
      ),
      'cortar',
      'Cortar',
      'Cortar tira as bordas da foto. É a tesoura.',
      'É o último da lista, com uma tesoura.',
    ),
    toque(
      'quadrado',
      'Escolha o formato do corte: toque em "Quadrado".',
      foto(
        [
          {
            tipo: 'fichas',
            itens: [
              { rotulo: 'Livre', id: 'livre' },
              { rotulo: 'Quadrado', id: 'quadrado' },
              { rotulo: '16:9', id: '16-9' },
              { rotulo: 'Retrato', id: 'retrato' },
            ],
          },
        ],
        'Cortar',
      ),
      'quadrado',
      'Quadrado',
      '"Quadrado" deixa a foto com os quatro lados iguais.',
      'É o segundo botão da fileira.',
    ),
    pergunta(
      'salvar',
      'Para não perder a foto original, qual botão devemos usar?',
      foto([{ tipo: 'texto', texto: 'Salvar troca a foto. Salvar cópia cria outra e guarda a original.', centro: true }], 'Cortar'),
      [
        { id: 'salvar', rotulo: 'Salvar' },
        { id: 'salvar-copia', rotulo: 'Salvar cópia' },
        { id: 'descartar', rotulo: 'Descartar' },
      ],
      'salvar-copia',
      ['Leia a frase na tela com atenção.', '"Salvar cópia" guarda a foto original.'],
      'Quase! Leia a frase da tela de novo: qual deles guarda a original?',
      'Na dúvida, salve uma cópia: a original fica segura.',
    ),
    toque(
      'voltar',
      'Cópia salva! Toque na seta para voltar à galeria.',
      foto([{ tipo: 'cartao', titulo: 'Cópia salva ✓', texto: 'Agora há 2 fotos do bolo: a original e a cortada.' }], 'Foto'),
      'voltar-galeria',
      'Voltar',
      'A seta no alto, à esquerda, volta.',
      'É a seta ← no alto da tela.',
    ),
  ],
}

// ---------------------------------------------------------------- Fase 3.3: arquivo certo
const arquivos = (selecionado?: string): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-pastas' }, titulo: 'Documentos' },
    {
      tipo: 'lista',
      titulo: selecionado ? 'Arquivo escolhido' : 'Arquivos',
      itens: selecionado
        ? [{ rotulo: selecionado, icone: '📄', inerte: true }]
        : [
            { rotulo: 'Convite Ana (rascunho)', id: 'arq-rascunho', icone: '📄', detalhe: 'Ontem, 21:15 · 98 KB' },
            { rotulo: 'Convite Ana FINAL', id: 'arq-final', icone: '📄', detalhe: 'Hoje, 09:10 · 120 KB' },
            { rotulo: 'Convite Ana (antigo)', id: 'arq-antigo', icone: '📄', detalhe: 'Há 2 meses · 64 KB' },
            { rotulo: 'Receita do bolo', id: 'arq-receita', icone: '📄', detalhe: 'Hoje, 08:30 · 40 KB' },
          ],
    },
  ],
})

export const w3Arquivo: Fase = {
  id: 'w3-arquivo',
  mundo: 3,
  titulo: 'Enviar o arquivo certo',
  simulador: 'arquivos',
  aplicativo: APP_FOTOS,
  historia: {
    abertura: [
      { quem: 'osvaldo', texto: 'Dona {nome}, a Ana pediu o convite em PDF para imprimir.' },
      { quem: 'neuza', texto: 'Há versões parecidas na pasta. Escolha a mais nova e mande só para a Ana.' },
    ],
    fechamento: [{ quem: 'ana', texto: 'Chegou o convite certinho, vó! Vou imprimir agora.' }],
    premio: { emoji: '📄', titulo: 'O convite certo' },
  },
  passos: [
    toque(
      'qual-arquivo',
      'Há quatro arquivos. Toque na versão final, a mais nova.',
      arquivos(),
      'arq-final',
      'Convite Ana FINAL',
      'Olhe a data embaixo de cada nome: a mais nova é a de hoje.',
      'O nome diz FINAL e a data é de hoje, às 09:10.',
    ),
    toque(
      'compartilhar',
      'Toque em "Compartilhar" para enviar o arquivo.',
      {
        blocos: [
          ...arquivos('Convite Ana FINAL').blocos,
          {
            tipo: 'lista',
            itens: [
              { rotulo: 'Excluir', icone: '🗑️', id: 'excluir' },
              { rotulo: 'Renomear', icone: '✏️', id: 'renomear' },
              { rotulo: 'Compartilhar', icone: '📤', id: 'compartilhar' },
            ],
          },
        ],
      },
      'compartilhar',
      'Compartilhar',
      'Compartilhar é o botão para mandar o arquivo a alguém. Excluir apaga.',
      'É o botão com uma seta saindo de uma caixa.',
    ),
    toque(
      'app',
      'Escolha por onde mandar: toque em "WhatsApp".',
      {
        blocos: [
          { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-pastas' }, titulo: 'Enviar por' },
          {
            tipo: 'atalhos',
            estilo: 'redondos',
            itens: [
              { rotulo: 'E-mail', icone: '✉️', id: 'email' },
              { rotulo: 'Bluetooth', icone: '🔵', id: 'bluetooth' },
              { rotulo: 'WhatsApp', icone: '💬', id: 'whatsapp' },
              { rotulo: 'Mais', icone: '⋯', id: 'mais' },
            ],
          },
        ],
      },
      'whatsapp',
      'WhatsApp',
      'Escolha o aplicativo que a Ana usa. A Ana recebe pelo WhatsApp.',
      'É o terceiro ícone, em forma de balãozinho.',
    ),
    toque(
      'contato',
      'Há duas Anas. Toque na sua neta: "Ana (neta)".',
      {
        blocos: [
          { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-pastas' }, titulo: 'Enviar para' },
          {
            tipo: 'lista',
            itens: [
              { rotulo: 'Ana Clara (vizinha do 12)', icone: '👤', id: 'ana-vizinha' },
              { rotulo: 'Ana (neta)', icone: '👩', id: 'ana-neta' },
              { rotulo: 'Seu Osvaldo', icone: '👴', id: 'osvaldo' },
            ],
          },
        ],
      },
      'ana-neta',
      'Ana (neta)',
      'Dois contatos têm nomes parecidos. Leia o nome inteiro, com a explicação entre parênteses.',
      'É o segundo da lista, com a foto de uma moça.',
    ),
    toque(
      'enviar',
      'Confira: arquivo FINAL, para a Ana (neta). Toque em "Enviar".',
      {
        blocos: [
          { tipo: 'barra', titulo: 'Confirmar' },
          {
            tipo: 'dados',
            titulo: 'Você vai enviar',
            linhas: [
              { rotulo: 'Arquivo', valor: 'Convite Ana FINAL' },
              { rotulo: 'Para', valor: 'Ana (neta)' },
            ],
          },
          { tipo: 'espaco' },
          { tipo: 'botao', item: { rotulo: 'Enviar', icone: '➤', id: 'enviar', principal: true } },
        ],
      },
      'enviar',
      'Enviar',
      'Antes de enviar, leia o resumo: quem recebe e qual arquivo.',
      'É o botão verde no pé da tela.',
    ),
  ],
}

export const fasesMundo3: Fase[] = [w3TirarFoto, w3Editar, w3Arquivo]
