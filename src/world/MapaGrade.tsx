import type { KeyboardEvent } from 'react'
import { altura, largura, obstaculosDe, type Direcao, type MapaDef, type Posicao } from '../core/world/grid'

type Props = {
  mapa: MapaDef
  posicao: Posicao
  avatar: string
  descricao: string // lida por leitores de tela
  anuncio?: string // frase anunciada quando o personagem chega a algum lugar
  aoMover: (d: Direcao) => void
  aoIrPara: (p: Posicao) => void
  aoConfirmar?: () => void // Enter ou espaço com o mapa em foco
  destaque?: string // id do objeto a destacar (última dica)
  bloqueados?: string[] // ids de objetos com cadeado
  concluidos?: string[] // ids de objetos já concluídos
}

const TECLAS: Record<string, Direcao> = {
  ArrowUp: 'cima',
  ArrowDown: 'baixo',
  ArrowLeft: 'esquerda',
  ArrowRight: 'direita',
}

export function MapaGrade({
  mapa,
  posicao,
  avatar,
  descricao,
  anuncio,
  aoMover,
  aoIrPara,
  aoConfirmar,
  destaque,
  bloqueados = [],
  concluidos = [],
}: Props) {
  const colunas = largura(mapa)
  const linhas = altura(mapa)
  const obstaculos = obstaculosDe(mapa)

  function aoTeclar(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return
    const direcao = TECLAS[e.key]
    if (direcao) {
      e.preventDefault() // setas não rolam a página
      aoMover(direcao)
    } else if ((e.key === 'Enter' || e.key === ' ') && aoConfirmar) {
      e.preventDefault()
      aoConfirmar()
    }
  }

  return (
    <div className="mapa">
      <div
        className="mapa__grade"
        role="group"
        tabIndex={0}
        aria-label={descricao}
        onKeyDown={aoTeclar}
        style={{ '--colunas': colunas, '--linhas': linhas } as React.CSSProperties}
      >
        {mapa.linhas.flatMap((linha, y) =>
          [...linha].map((c, x) => {
            const objeto = mapa.legenda[c]
            const obstaculo = obstaculos[c]
            const xadrez = (x + y) % 2 === 1 ? ' mapa__celula--b' : ''
            return (
              <div
                key={`${x},${y}`}
                className={`mapa__celula${xadrez}`}
                onClick={obstaculo ? undefined : () => aoIrPara({ x, y })}
              >
                {obstaculo && <span aria-hidden="true">{obstaculo}</span>}
                {objeto && (
                  <button
                    type="button"
                    className={`mapa__objeto${destaque === objeto.id ? ' destacado' : ''}`}
                    aria-label={
                      objeto.rotulo +
                      (bloqueados.includes(objeto.id) ? ' (ainda bloqueado)' : '') +
                      (concluidos.includes(objeto.id) ? ' (concluído)' : '')
                    }
                  >
                    <span aria-hidden="true">{objeto.emoji}</span>
                    {bloqueados.includes(objeto.id) && (
                      <span className="mapa__selo" aria-hidden="true">
                        🔒
                      </span>
                    )}
                    {concluidos.includes(objeto.id) && (
                      <span className="mapa__selo" aria-hidden="true">
                        ✅
                      </span>
                    )}
                  </button>
                )}
              </div>
            )
          }),
        )}
        <div className="mapa__personagem" aria-hidden="true" style={{ '--x': posicao.x, '--y': posicao.y } as React.CSSProperties}>
          <span>{avatar}</span>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </div>
  )
}
