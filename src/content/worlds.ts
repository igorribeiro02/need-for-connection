import type { BancoConfig, Fase, Mundo } from '../core/engine/stepTypes'
import { bancos } from './banks'
import { w0Andar } from './phases/w0-andar'
import { w0Desbloquear, w0Icones } from './phases/w0-celular-inicial'
import { w0Deslizar } from './phases/w0-deslizar'
import { w0Teclado } from './phases/w0-teclado'
import { fasesMundo1 } from './phases/w1-celular'
import { fasesMundo2 } from './phases/w2-mensagens'
import { fasesMundo5 } from './phases/w5-golpes'
import { fasesMundo6 } from './phases/w6-servicos'
import { w4PixChave, w4PixCelular, w4PixCnpj, w4PixCpf, w4PixNome } from './phases/w4-pix'
import { w799Pedir, w7ConferirMotorista, w7UberPedir } from './phases/w7-transporte'

// Para criar uma fase nova: crie o arquivo em phases/ e coloque-a na lista do mundo.
export const mundos: Mundo[] = [
  {
    numero: 0,
    titulo: 'Primeiros toques',
    descricao: 'Aprenda os gestos da tela, um de cada vez.',
    obrigatorio: true,
    dia: 'Domingo, a chegada',
    fases: [w0Desbloquear, w0Icones, w0Deslizar, w0Teclado, w0Andar],
    historiaFinal: {
      falas: [
        { quem: 'ana', texto: 'Oi, {nome}! Soube que você chegou na vila. Amanhã eu te ligo.' },
        { quem: 'ana', texto: 'No próximo domingo é meu aniversário, com almoço no Mercado Central. Você vem?' },
        { quem: 'neuza', texto: 'Ela quer muito que você vá! Vamos nos preparar durante a semana, um dia de cada vez.' },
      ],
      premio: { emoji: '🎂', titulo: 'O convite da Ana' },
    },
  },
  {
    numero: 1,
    dia: 'Segunda',
    titulo: 'Celular no dia a dia',
    descricao: 'Volume, brilho, pop-ups e print.',
    fases: fasesMundo1,
    historiaFinal: {
      falas: [
        { quem: 'ana', texto: 'Agora eu te ouvi e te vi! Que bom ver o seu rosto na chamada, {nome}.' },
        { quem: 'ana', texto: 'Amanhã mando o convite no grupo da família. Fica de olho, tá?' },
      ],
      premio: { emoji: '📞', titulo: 'A chamada de vídeo' },
    },
  },
  {
    numero: 2,
    dia: 'Terça',
    titulo: 'Mensagens',
    descricao: 'Ler, responder, mandar foto, arquivo e áudio no WhatsApp.',
    fases: fasesMundo2,
    historiaFinal: {
      falas: [
        { quem: 'ana', texto: 'Recebi tudo, vó! Foto, convite, resposta e até o áudio. Você está ótima.' },
        { quem: 'neuza', texto: 'Amanhã é dia de Pix. Respire fundo: você já está bem preparada.' },
      ],
      premio: { emoji: '💌', titulo: 'Conversa em dia' },
    },
  },
  {
    numero: 3,
    dia: 'Quarta',
    titulo: 'Banco e Pix',
    descricao: 'Fazer um Pix passo a passo, no aplicativo parecido com o do seu banco.',
    fases: [w4PixChave, w4PixCelular, w4PixCpf, w4PixCnpj, w4PixNome],
    historiaFinal: {
      falas: [
        { quem: 'ana', texto: 'Bolo pago e festa quase pronta! Você está craque no Pix, {nome}.' },
        { quem: 'neuza', texto: 'Hoje o Seu Osvaldo quase pagou a pessoa errada. Por isso, confira sempre antes de confirmar.' },
      ],
      premio: { emoji: '🎟️', titulo: 'Pix sem susto' },
    },
  },
  {
    numero: 4,
    dia: 'Quinta',
    titulo: 'Golpes',
    descricao: 'Mensagens, ligações e pedidos falsos: saber quando desconfiar.',
    fases: fasesMundo5,
    historiaFinal: {
      falas: [
        { quem: 'sorrateiro', texto: 'Hmpf... esta aí não caiu. Vou procurar outra vítima.' },
        { quem: 'neuza', texto: 'Na dúvida, pare, respire e confira por outro caminho. Isso vale mais que qualquer pressa.' },
      ],
      premio: { emoji: '🦊', titulo: 'Ninguém te engana' },
    },
  },
  {
    numero: 5,
    dia: 'Sexta',
    titulo: 'Serviços e compras',
    descricao: 'Marcar consulta, entrar no gov.br e comprar com cuidado.',
    fases: fasesMundo6,
    historiaFinal: {
      falas: [
        { quem: 'neuza', texto: 'Consulta marcada, documentos à mão e presente comprado. Daqui a pouco é a festa!' },
        { quem: 'ana', texto: 'Estou ansiosa, vó! O carro vai buscar você no domingo.' },
      ],
      premio: { emoji: '🎁', titulo: 'Tudo pronto' },
    },
  },
  {
    numero: 6,
    dia: 'Domingo, a festa',
    titulo: 'Transporte por aplicativo',
    descricao: 'Pedir um carro no Uber ou na 99 e conferir o motorista, passo a passo.',
    fases: [w7UberPedir, w799Pedir, w7ConferirMotorista],
    historiaFinal: {
      falas: [
        { quem: 'ana', texto: 'Você veio! E chegou de carro, pelo aplicativo e tudo.' },
        { quem: 'ana', texto: 'Obrigada por estar aqui, {nome}. Esta semana você aprendeu muita coisa!' },
        { quem: 'neuza', texto: 'A semana acabou, mas a vila é sua. Volte quando quiser treinar.' },
      ],
      premio: { emoji: '🎉', titulo: 'A festa da Ana' },
    },
  },
]

export function todasAsFases(): Fase[] {
  return mundos.flatMap((m) => m.fases)
}

export function buscarFase(id: string): Fase | undefined {
  return todasAsFases().find((f) => f.id === id)
}

/** Fases de banco geram os passos conforme o banco; as demais voltam como estão. */
export function resolverFase(fase: Fase, banco?: BancoConfig): Fase {
  if (!fase.gerarPassos) return fase
  return banco ? { ...fase, passos: fase.gerarPassos(banco) } : fase
}

/** Todas as fases já com passos; as de banco aparecem uma vez para cada banco (para os testes). */
export function todasAsFasesResolvidas(): { fase: Fase; banco?: BancoConfig }[] {
  return todasAsFases().flatMap((f) =>
    f.gerarPassos ? bancos.map((b) => ({ fase: resolverFase(f, b), banco: b })) : [{ fase: f }],
  )
}
