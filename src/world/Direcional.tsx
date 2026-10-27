import type { Direcao } from '../core/world/grid'

const BOTOES: { direcao: Direcao; seta: string; texto: string }[] = [
  { direcao: 'cima', seta: '▲', texto: 'Andar para cima' },
  { direcao: 'esquerda', seta: '◀', texto: 'Andar para a esquerda' },
  { direcao: 'direita', seta: '▶', texto: 'Andar para a direita' },
  { direcao: 'baixo', seta: '▼', texto: 'Andar para baixo' },
]

/** Quatro botões grandes em cruz, para quem anda com o dedo em vez do teclado. */
export function Direcional({ aoMover }: { aoMover: (d: Direcao) => void }) {
  return (
    <div className="direcional" role="group" aria-label="Botões para andar">
      {BOTOES.map((b) => (
        <button
          key={b.direcao}
          type="button"
          className={`botao direcional__${b.direcao}`}
          aria-label={b.texto}
          onClick={() => aoMover(b.direcao)}
        >
          {b.seta}
        </button>
      ))}
    </div>
  )
}
