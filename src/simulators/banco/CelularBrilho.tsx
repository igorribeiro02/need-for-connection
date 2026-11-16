import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { marcaSalva, EVENTO_MARCA } from '../../features/guiaCelular/GuiaCelularReal'
import type { ItemApp } from '../../core/engine/stepTypes'

type Props = {
  etapa: 'puxar' | 'ajustar' | 'ler'
  valor: number // brilho de que a tela começa (0 a 100)
  minimo?: number
  maximo?: number
  item: ItemApp
  ativo: boolean // o passo pede mesmo este gesto (e não é só enfeite)
  destacado: boolean // modo "Me mostre onde tocar"
  aoAcertar: () => void
  aoAvisar: (texto: string) => void
}

const DESLIZE_MINIMO = 40 // px que o dedo precisa descer para valer
const DESLIZE_MAXIMO = 110

/**
 * Celular desenhado como no guia "Como fazer no meu celular de verdade": a pessoa desliza a bolinha de cima para baixo,
 * abre o painel e arrasta o brilho (barra comprida no iPhone, barra deitada nas outras marcas). A tela do celular
 * clareia e escurece enquanto o dedo mexe.
 */
export function CelularBrilho({ etapa, valor, minimo, maximo, item, ativo, destacado, aoAcertar, aoAvisar }: Props) {
  const [marca, setMarca] = useState(marcaSalva)
  useEffect(() => {
    const atualizar = () => setMarca(marcaSalva())
    window.addEventListener(EVENTO_MARCA, atualizar)
    return () => window.removeEventListener(EVENTO_MARCA, atualizar)
  }, [])
  const iphone = marca === 'iphone'

  const [brilho, setBrilho] = useState(valor)
  const [descida, setDescida] = useState(0)
  const arrastando = useRef(false)
  const inicioY = useRef(0)
  const trilho = useRef<HTMLDivElement>(null)

  // ---- 1) deslizar a bolinha para baixo ----
  function comecarDescida(e: PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    arrastando.current = true
    inicioY.current = e.clientY
  }
  function moverDescida(e: PointerEvent<HTMLButtonElement>) {
    if (arrastando.current) setDescida(Math.max(0, Math.min(DESLIZE_MAXIMO, e.clientY - inicioY.current)))
  }
  function soltarDescida() {
    if (!arrastando.current) return
    arrastando.current = false
    const foi = descida >= DESLIZE_MINIMO
    setDescida(0)
    // no modo guiado ("Me mostre onde tocar") um toque basta, para quem não consegue deslizar
    if (foi || destacado || !ativo) aoAcertar()
    else aoAvisar('Ponha o dedo na bolinha laranja e arraste para baixo, sem soltar, como quem puxa uma cortina.')
  }

  // ---- 2) arrastar o brilho ----
  function valorDoDedo(e: PointerEvent<HTMLDivElement>): number {
    const r = trilho.current!.getBoundingClientRect()
    const fracao = iphone ? 1 - (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width
    return Math.round(Math.max(0, Math.min(1, fracao)) * 100)
  }
  function soltarBrilho(v: number) {
    const ok = (minimo === undefined || v >= minimo) && (maximo === undefined || v <= maximo)
    if (ok || !ativo) aoAcertar()
    else
      aoAvisar(
        minimo !== undefined
          ? `Ainda está escuro. Arraste mais para ${iphone ? 'CIMA' : 'a DIREITA'}, até o sol grande.`
          : `Ainda está muito claro. Arraste um pouco para ${iphone ? 'BAIXO' : 'a ESQUERDA'}.`,
      )
  }
  function comecarBrilho(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    arrastando.current = true
    setBrilho(valorDoDedo(e))
  }
  function moverBrilho(e: PointerEvent<HTMLDivElement>) {
    if (arrastando.current) setBrilho(valorDoDedo(e))
  }
  function largarBrilho(e: PointerEvent<HTMLDivElement>) {
    if (!arrastando.current) return
    arrastando.current = false
    soltarBrilho(valorDoDedo(e))
  }
  function tecla(e: KeyboardEvent<HTMLDivElement>) {
    const passo = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 10 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -10 : 0
    if (e.key === 'Home') setBrilho(0)
    else if (e.key === 'End') setBrilho(100)
    else if (passo) setBrilho((b) => Math.max(0, Math.min(100, b + passo)))
    else if (e.key === 'Enter') soltarBrilho(brilho)
    if (passo || e.key === 'Home' || e.key === 'End') e.preventDefault()
  }

  const dedoDoCanto = marca === 'motorola' ? 'centro' : 'direita'
  const claridade = 0.35 + (0.65 * brilho) / 100
  const rotuloGesto = etapa === 'puxar' ? 1 : 2

  return (
    <div className={`cel-bril cel-bril--${marca}`}>
      <div className="cel-bril__rotulos">
        <p className={`cel-bril__rotulo${rotuloGesto === 1 ? ' ativo' : ''}`}>1. Deslize para baixo</p>
        <p className={`cel-bril__rotulo${rotuloGesto === 2 ? ' ativo' : ''}`}>2. Arraste a bolinha do sol</p>
      </div>

      <div className="cel-bril__celular">
        <span className="cel-bril__lado cel-bril__lado--dir" aria-hidden="true" />
        <span className="cel-bril__lado cel-bril__lado--esq" aria-hidden="true" />
        <span className="cel-bril__ilha" aria-hidden="true" />
        <div className="cel-bril__tela">
          <span className="cel-bril__escuro" style={{ opacity: 1 - claridade }} aria-hidden="true" />
          {etapa === 'puxar' && (
            <>
              <span className={`cel-bril__seta cel-bril__seta--${dedoDoCanto}`} aria-hidden="true" />
              <button
                type="button"
                className={`cel-bril__bolinha cel-bril__bolinha--${dedoDoCanto}${destacado ? ' destacado' : ''}`}
                style={{ transform: `translateY(${descida}px)` }}
                aria-label={`${item.rotulo} (arraste para baixo)`}
                onPointerDown={comecarDescida}
                onPointerMove={moverDescida}
                onPointerUp={soltarDescida}
                onPointerCancel={() => {
                  arrastando.current = false
                  setDescida(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    aoAcertar()
                  }
                }}
              />
            </>
          )}

          {etapa === 'ajustar' && (
            <div className="cel-bril__painel">
              {iphone && <span className="cel-bril__dica">barra do brilho →</span>}
              <div
                ref={trilho}
                className={`cel-bril__barra cel-bril__barra--${iphone ? 'em-pe' : 'deitada'}${destacado ? ' destacado' : ''}`}
                role="slider"
                tabIndex={0}
                aria-label="Brilho da tela"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={brilho}
                onDragStart={(e) => e.preventDefault()}
                onPointerDown={comecarBrilho}
                onPointerMove={moverBrilho}
                onPointerUp={largarBrilho}
                onPointerCancel={() => (arrastando.current = false)}
                onKeyDown={tecla}
              >
                <span className="cel-bril__enchimento" style={iphone ? { height: `${brilho}%` } : { width: `${brilho}%` }} />
                <span
                  className="cel-bril__sol"
                  style={iphone ? { bottom: `calc(${brilho}% - 1.2rem)` } : { left: `calc(${brilho}% - 1.2rem)` }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
                  </svg>
                </span>
              </div>
              <span className="cel-bril__seta-brilho" aria-hidden="true">
                {minimo !== undefined ? (iphone ? '⬆' : '➡') : iphone ? '⬇' : '⬅'}
              </span>
            </div>
          )}

          <div className="cel-bril__mensagem">
            {etapa === 'ler' ? (
              <button type="button" className={`cel-bril__msg-botao${destacado ? ' destacado' : ''}`} onClick={aoAcertar}>
                <strong>💬 Ana</strong>
                <span>Bom dia, vó! Já acordou?</span>
              </button>
            ) : (
              <p className="cel-bril__msg-fixa">
                <strong>💬 Ana</strong>
                <span>Bom dia, vó! Já acordou?</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
