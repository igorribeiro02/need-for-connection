import type { AppTransporte, BlocoApp, Fase, TelaApp } from '../../core/engine/stepTypes'
import { digitar, pergunta, toque } from '../transporte/passos'

const APP_INICIO: AppTransporte = {
  id: 'celular',
  nome: 'Celular',
  tema: { corPrincipal: '#1b4b8f', corDestaque: '#1b4b8f', link: '#1b4b8f' },
  fonte: 'Tela de bloqueio e tela inicial genéricas de celular Android. Os nomes e os desenhos variam de marca.',
}

// ---------------------------------------------------------------- Desbloquear
const bloqueio = (blocos: BlocoApp[] = []): TelaApp => ({
  escuro: true,
  blocos: [
    { tipo: 'titulo', texto: '09:41', apoio: '{hoje}' },
    { tipo: 'cartao', titulo: '🔒 Celular trancado', texto: 'Ele fica trancado para ninguém mexer nas suas coisas.' },
    { tipo: 'espaco' },
    ...blocos,
  ],
})

export const w0Desbloquear: Fase = {
  id: 'w0-desbloquear',
  mundo: 0,
  titulo: 'Destrancar o celular',
  simulador: 'celular',
  aplicativo: APP_INICIO,
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'Ele acordou, mas está trancado. É para ninguém mexer nas suas coisas.' },
      { quem: 'neuza', texto: 'Para destrancar, você usa um código de números. Vamos treinar com o código 2580.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Destrancou! Guarde o seu código de verdade só na cabeça, nunca num bilhete.' }],
    premio: { emoji: '🔓', titulo: 'O código certo' },
  },
  passos: [
    toque(
      'acordar',
      'A tela apagou. Toque em "Acordar o celular" para ele acender.',
      bloqueio([
        {
          tipo: 'lista',
          estilo: 'caixas',
          itens: [
            { rotulo: 'Apagar tudo', icone: '🗑️', id: 'apagar' },
            { rotulo: 'Acordar o celular', icone: '☀️', id: 'acordar' },
          ],
        },
      ]),
      'acordar',
      'Acordar o celular',
      'Para acender a tela, toque nela ou no botão de ligar.',
      'É o botão da direita, com um sol.',
    ),
    toque(
      'subir',
      'Para pedir o código, toque em "Deslizar para cima".',
      bloqueio([{ tipo: 'botao', item: { rotulo: 'Deslizar para cima', icone: '⬆️', id: 'subir', principal: true } }]),
      'subir',
      'Deslizar para cima',
      'Na vida real, você passa o dedo de baixo para cima. Aqui, basta tocar.',
      'É o botão azul grande, no pé da tela.',
    ),
    {
      ...digitar(
        'codigo',
        'Escreva o código 2580 e toque em OK.',
        bloqueio([{ tipo: 'campo', icone: '🔢' }]),
        '2580',
        'Código',
        'OK',
        'O celular pede um código de números para destrancar.',
      ),
      teclado: 'numero',
    },
    pergunta(
      'guardar',
      'Para guardar o código de verdade, qual é o jeito mais seguro?',
      bloqueio([{ tipo: 'texto', texto: '🔓 Destrancado!', centro: true }]),
      [
        { id: 'bilhete', rotulo: 'Anotar num bilhete dentro da capinha' },
        { id: 'cabeca', rotulo: 'Decorar e não contar a ninguém' },
        { id: 'zap', rotulo: 'Mandar para um amigo "para guardar"' },
      ],
      'cabeca',
      ['Pense em quem poderia achar o código.', 'O mais seguro é decorar e não contar.'],
      'Quase! O código só funciona se mais ninguém souber.',
      'O código do celular é só seu. Não anote junto do aparelho nem conte a ninguém.',
    ),
  ],
}

// ---------------------------------------------------------------- Ícones
const inicio = (blocos: BlocoApp[] = [], titulo = 'Tela inicial'): TelaApp => ({
  blocos: [
    { tipo: 'titulo', texto: titulo, apoio: '{hoje}' },
    {
      tipo: 'atalhos',
      titulo: 'Aplicativos',
      estilo: 'redondos',
      itens: [
        { rotulo: 'Telefone', icone: '📞', id: 'telefone' },
        { rotulo: 'Mensagens', icone: '💬', id: 'mensagens' },
        { rotulo: 'Câmera', icone: '📷', id: 'camera' },
        { rotulo: 'Galeria', icone: '🖼️', id: 'galeria' },
        { rotulo: 'Relógio', icone: '⏰', id: 'relogio' },
        { rotulo: 'Ajustes', icone: '⚙️', id: 'ajustes' },
      ],
    },
    ...blocos,
  ],
})

const dentro = (titulo: string, texto: string): TelaApp => ({
  blocos: [
    { tipo: 'barra', voltar: { rotulo: 'Voltar', icone: '←', id: 'voltar-inicio' }, titulo },
    { tipo: 'cartao', titulo, texto },
    { tipo: 'espaco' },
    { tipo: 'botao', item: { rotulo: 'Início', icone: '🏠', id: 'inicio' } },
  ],
})

export const w0Icones: Fase = {
  id: 'w0-icones',
  mundo: 0,
  titulo: 'A tela inicial e os aplicativos',
  simulador: 'celular',
  aplicativo: APP_INICIO,
  historia: {
    abertura: [
      { quem: 'neuza', texto: 'Esta é a tela inicial. Cada figurinha é um aplicativo, um "programinha" do celular.' },
      { quem: 'neuza', texto: 'Vamos abrir alguns e aprender a voltar. Se se perder, o botão Início leva você para casa.' },
    ],
    fechamento: [{ quem: 'neuza', texto: 'Você já abre e fecha aplicativos sozinho. Isso é a base de tudo.' }],
    premio: { emoji: '🏠', titulo: 'A tela inicial' },
  },
  passos: [
    toque(
      'qual-ligar',
      'Qual aplicativo serve para fazer uma ligação? Toque nele.',
      inicio(),
      'telefone',
      'Telefone',
      'O desenho e o nome do ícone dizem para que ele serve.',
      'É o primeiro ícone, com um fone de telefone.',
    ),
    toque(
      'abrir-camera',
      'Abra a Câmera: toque no ícone da câmera de fotos.',
      inicio(),
      'camera',
      'Câmera',
      'Para abrir um aplicativo, toque no ícone dele uma vez.',
      'É o terceiro ícone, com uma câmera.',
    ),
    toque(
      'voltar',
      'A Câmera abriu. Toque na seta no alto para voltar à tela inicial.',
      dentro('Câmera', 'Pronta para tirar fotos.'),
      'voltar-inicio',
      'Voltar',
      'A seta no alto, à esquerda, volta para a tela anterior.',
      'É a seta ← no canto de cima, à esquerda.',
    ),
    toque(
      'abrir-mensagens',
      'Agora abra as Mensagens.',
      inicio(),
      'mensagens',
      'Mensagens',
      'Procure o ícone com um balãozinho de conversa.',
      'É o segundo ícone.',
    ),
    toque(
      'botao-inicio',
      'Para ir direto à tela inicial, toque no botão "Início", com uma casinha.',
      dentro('Mensagens', 'Nenhuma conversa ainda.'),
      'inicio',
      'Início',
      'O botão com a casinha leva você à tela inicial de qualquer lugar.',
      'É o botão no pé da tela, com uma casinha.',
    ),
  ],
}

export const celularInicial: Fase[] = [w0Desbloquear, w0Icones]
