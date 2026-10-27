import { useEffect, useRef } from 'react'
import type { Passo } from '../../core/engine/stepTypes'

type Props = { passo: Passo; aoResponder: (resposta: string) => void }

function reduzido(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Lista que rola com o dedo, a roda do mouse ou o teclado. Os botões são a alternativa ao gesto. */
export function ListaDeslizante({ passo, aoResponder }: Props) {
  const caixa = useRef<HTMLDivElement>(null)
  const respondido = useRef(false)

  useEffect(() => {
    if (passo.posicaoInicial === 'fim' && caixa.current) caixa.current.scrollTop = caixa.current.scrollHeight
  }, [passo.posicaoInicial])

  function aoRolar() {
    const el = caixa.current
    if (!el || respondido.current) return
    const noFim = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
    const noTopo = el.scrollTop <= 1
    // só conta quando chega na ponta pedida; passar pela outra ponta não é erro
    if ((passo.alvo === 'fim' && noFim) || (passo.alvo === 'inicio' && noTopo)) {
      respondido.current = true
      aoResponder(passo.alvo)
    }
  }

  function rolar(sentido: 1 | -1) {
    caixa.current?.scrollBy({ top: sentido * 120, behavior: reduzido() ? 'auto' : 'smooth' })
  }

  return (
    <>
      <div ref={caixa} className="lista-desliza" tabIndex={0} role="region" aria-label="Lista de contatos" onScroll={aoRolar}>
        <ul>
          {(passo.elementos ?? []).map((el) => (
            <li key={el.id}>{el.rotulo}</li>
          ))}
        </ul>
      </div>
      <div className="linha">
        <button type="button" className="botao botao--secundario" onClick={() => rolar(1)}>
          ▼ Descer
        </button>
        <button type="button" className="botao botao--secundario" onClick={() => rolar(-1)}>
          ▲ Subir
        </button>
      </div>
      <p className="ajuda-campo">Você pode deslizar com o dedo ou usar estes botões.</p>
    </>
  )
}
