import type { BancoConfig, Fase, Mundo } from '../core/engine/stepTypes'
import { bancos } from './banks'
import { w0Andar } from './phases/w0-andar'
import { w0Deslizar } from './phases/w0-deslizar'
import { w0Teclado } from './phases/w0-teclado'
import { w0Tocar } from './phases/w0-tocar'
import { fasesMundo1 } from './phases/w1-celular'
import { w4PixChave, w4PixNome } from './phases/w4-pix'
import { w799Pedir, w7ConferirMotorista, w7UberPedir } from './phases/w7-transporte'

// Para criar uma fase nova: crie o arquivo em phases/ e coloque-a na lista do mundo.
export const mundos: Mundo[] = [
  {
    numero: 0,
    titulo: 'Primeiros toques',
    descricao: 'Aprenda os gestos da tela, um de cada vez.',
    obrigatorio: true,
    dia: 'Domingo, a chegada',
    fases: [w0Tocar, w0Deslizar, w0Teclado, w0Andar],
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
  { numero: 2, dia: 'Terça', titulo: 'Mensagens', descricao: 'Ler, responder e mandar fotos.', fases: [] },
  { numero: 3, dia: 'Quarta', titulo: 'Fotos e arquivos', descricao: 'Salvar, editar e enviar.', fases: [] },
  {
    numero: 4,
    dia: 'Quinta',
    titulo: 'Banco e Pix',
    descricao: 'Fazer um Pix passo a passo, no aplicativo parecido com o do seu banco.',
    fases: [w4PixChave, w4PixNome],
    historiaFinal: {
      falas: [
        { quem: 'ana', texto: 'Bolo pago e festa quase pronta! Você está craque no Pix, {nome}.' },
        { quem: 'neuza', texto: 'Hoje o Seu Osvaldo quase pagou a pessoa errada. Por isso, confira sempre antes de confirmar.' },
      ],
      premio: { emoji: '🎟️', titulo: 'Pix sem susto' },
    },
  },
  { numero: 5, dia: 'Sexta', titulo: 'Golpes', descricao: 'Saber quando desconfiar.', fases: [] },
  { numero: 6, dia: 'Sábado', titulo: 'Serviços e compras', descricao: 'Consulta, gov.br e compras.', fases: [] },
  {
    numero: 7,
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
