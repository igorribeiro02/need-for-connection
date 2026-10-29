import type { BancoConfig, Fase, Mundo } from '../core/engine/stepTypes'
import { bancos } from './banks'
import { w0Andar } from './phases/w0-andar'
import { w0Deslizar } from './phases/w0-deslizar'
import { w0Teclado } from './phases/w0-teclado'
import { w0Tocar } from './phases/w0-tocar'
import { w4PixChave, w4PixNome } from './phases/w4-pix'

// Para criar uma fase nova: crie o arquivo em phases/ e coloque-a na lista do mundo.
export const mundos: Mundo[] = [
  {
    numero: 0,
    titulo: 'Primeiros toques',
    descricao: 'Aprenda os gestos da tela, um de cada vez.',
    obrigatorio: true,
    fases: [w0Tocar, w0Deslizar, w0Teclado, w0Andar],
  },
  { numero: 1, titulo: 'Celular no dia a dia', descricao: 'Volume, brilho, pop-ups e print.', fases: [] },
  { numero: 2, titulo: 'Mensagens', descricao: 'Ler, responder e mandar fotos.', fases: [] },
  { numero: 3, titulo: 'Fotos e arquivos', descricao: 'Salvar, editar e enviar.', fases: [] },
  { numero: 4, titulo: 'Banco e Pix', descricao: 'Fazer um Pix passo a passo, no aplicativo parecido com o do seu banco.', fases: [w4PixChave, w4PixNome] },
  { numero: 5, titulo: 'Golpes', descricao: 'Saber quando desconfiar.', fases: [] },
  { numero: 6, titulo: 'Serviços e compras', descricao: 'Consulta, gov.br e compras.', fases: [] },
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
