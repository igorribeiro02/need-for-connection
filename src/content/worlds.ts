import type { Fase, Mundo } from '../core/engine/stepTypes'
import { w0Tocar } from './phases/w0-tocar'

// Para criar uma fase nova: crie o arquivo em phases/ e coloque-a na lista do mundo.
export const mundos: Mundo[] = [
  {
    numero: 0,
    titulo: 'Primeiros toques',
    descricao: 'Aprenda os gestos da tela, um de cada vez.',
    obrigatorio: true,
    fases: [w0Tocar],
  },
  { numero: 1, titulo: 'Celular no dia a dia', descricao: 'Volume, brilho, pop-ups e print.', fases: [] },
  { numero: 2, titulo: 'Mensagens', descricao: 'Ler, responder e mandar fotos.', fases: [] },
  { numero: 3, titulo: 'Fotos e arquivos', descricao: 'Salvar, editar e enviar.', fases: [] },
  { numero: 4, titulo: 'Banco e Pix', descricao: 'Fazer um Pix passo a passo.', fases: [] },
  { numero: 5, titulo: 'Golpes', descricao: 'Saber quando desconfiar.', fases: [] },
  { numero: 6, titulo: 'Serviços e compras', descricao: 'Consulta, gov.br e compras.', fases: [] },
]

export function todasAsFases(): Fase[] {
  return mundos.flatMap((m) => m.fases)
}

export function buscarFase(id: string): Fase | undefined {
  return todasAsFases().find((f) => f.id === id)
}
