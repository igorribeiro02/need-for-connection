import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { marcaSalva, escolherMarca, EVENTO_MARCA } from '../../features/guiaCelular/GuiaCelularReal'
import { marcas, type Marca } from '../../content/guias/celularReal'
import type { ItemApp } from '../../core/engine/stepTypes'

type Props = {
  etapa: 'puxar' | 'ajustar' | 'ler'
  valor: number // brilho com que a tela começa (0 a 100)
  minimo?: number
  maximo?: number
  item: ItemApp
  ativo: boolean // o passo pede mesmo este gesto
  destacado: boolean // modo "Me mostre onde tocar"
  aoAcertar: () => void
  aoAvisar: (texto: string) => void
}

const DESLIZE_MINIMO = 40 // px que o dedo precisa descer para valer
const DESLIZE_MAXIMO = 110

/** O que muda de marca para marca: de onde o dedo parte, quantas vezes, e como é a barra do brilho. */
const JEITO: Record<Marca, { canto: 'direita' | 'centro'; vezes: 1 | 2; barraEmPe: boolean; gesto: string; barra: string }> = {
  iphone: { canto: 'direita', vezes: 1, barraEmPe: true, gesto: 'do canto de cima, à direita', barra: 'Barra do sol: arraste para CIMA' },
  samsung: {
    canto: 'direita',
    vezes: 1,
    barraEmPe: false,
    gesto: 'do canto de cima, à direita',
    barra: 'Bolinha do sol: arraste para a DIREITA',
  },
  motorola: {
    canto: 'centro',
    vezes: 2,
    barraEmPe: false,
    gesto: 'do meio de cima (às vezes 2 vezes)',
    barra: 'Bolinha do sol: arraste para a DIREITA',
  },
  xiaomi: { canto: 'direita', vezes: 1, barraEmPe: true, gesto: 'do canto de cima, à direita', barra: 'Barra do sol: arraste para CIMA' },
}

const Sol = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
  </svg>
)

function Tile({ ativo, children, cls = '' }: { ativo?: boolean; children?: ReactNode; cls?: string }) {
  return (
    <span className={`cb-tile${ativo ? ' ligado' : ''} ${cls}`} aria-hidden="true">
      {children}
    </span>
  )
}

function BarraStatus() {
  return (
    <div className="cb-status" aria-hidden="true">
      <span className="cb-status__hora">09:41</span>
      <span className="cb-status__icones">
        <svg viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="1" y="1" width="17" height="10" rx="3" />
          <rect x="3" y="3" width="11" height="6" rx="1.5" fill="currentColor" stroke="none" />
          <path d="M20 4.5v3" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  )
}

/**
 * Celular desenhado com o painel de atalhos de cada marca: a pessoa desliza a bolinha de cima para baixo, abre o painel
 * e arrasta o brilho. A tela do celular clareia e escurece enquanto o dedo mexe.
 */
export function CelularBrilho({ etapa, valor, minimo, maximo, item, ativo, destacado, aoAcertar, aoAvisar }: Props) {
  const [marca, setMarca] = useState<Marca>(marcaSalva)
  useEffect(() => {
    const atualizar = () => setMarca(marcaSalva())
    window.addEventListener(EVENTO_MARCA, atualizar)
    return () => window.removeEventListener(EVENTO_MARCA, atualizar)
  }, [])
  const jeito = JEITO[marca]
  const emPe = jeito.barraEmPe

  const [brilho, setBrilho] = useState(valor)
  const [descida, setDescida] = useState(0)
  const [soAvisos, setSoAvisos] = useState(false) // Motorola: o primeiro deslize só mostra os avisos
  const arrastando = useRef(false)
  const inicioY = useRef(0)
  const trilho = useRef<HTMLDivElement>(null)

  useEffect(() => setSoAvisos(false), [marca, etapa])

  // ---- 1) deslizar para baixo ----
  function comecarDescida(e: PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    arrastando.current = true
    inicioY.current = e.clientY
  }
  function moverDescida(e: PointerEvent<HTMLButtonElement>) {
    if (arrastando.current) setDescida(Math.max(0, Math.min(DESLIZE_MAXIMO, e.clientY - inicioY.current)))
  }
  function terminarDescida(foi: boolean) {
    // no modo guiado ("Me mostre onde tocar") um toque basta, para quem não consegue deslizar
    if (!(foi || destacado || !ativo)) {
      aoAvisar('Ponha o dedo na bolinha laranja e arraste para baixo, sem soltar, como quem puxa uma cortina.')
      return
    }
    if (jeito.vezes === 2 && !soAvisos) setSoAvisos(true)
    else aoAcertar()
  }
  function soltarDescida() {
    if (!arrastando.current) return
    arrastando.current = false
    const foi = descida >= DESLIZE_MINIMO
    setDescida(0)
    terminarDescida(foi)
  }
  function cancelarDescida() {
    arrastando.current = false
    setDescida(0)
  }
  const bolinha = (extra: string) => (
    <button
      type="button"
      className={`cb-bolinha ${extra}${destacado ? ' destacado' : ''}`}
      style={{ transform: `translateY(${descida}px)` }}
      aria-label={`${item.rotulo} (arraste para baixo)`}
      onPointerDown={comecarDescida}
      onPointerMove={moverDescida}
      onPointerUp={soltarDescida}
      onPointerCancel={cancelarDescida}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          terminarDescida(true)
        }
      }}
    />
  )

  // ---- 2) arrastar o brilho ----
  function valorDoDedo(e: PointerEvent<HTMLDivElement>): number {
    const r = trilho.current!.getBoundingClientRect()
    const fracao = emPe ? 1 - (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width
    return Math.round(Math.max(0, Math.min(1, fracao)) * 100)
  }
  function soltarBrilho(v: number) {
    const ok = (minimo === undefined || v >= minimo) && (maximo === undefined || v <= maximo)
    if (ok || !ativo) aoAcertar()
    else
      aoAvisar(
        minimo !== undefined
          ? `Ainda está escuro. Arraste mais para ${emPe ? 'CIMA' : 'a DIREITA'}, até o fim.`
          : `Ainda está muito claro. Arraste um pouco para ${emPe ? 'BAIXO' : 'a ESQUERDA'}.`,
      )
  }
  const largar = (e: PointerEvent<HTMLDivElement>) => {
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
  const barra = (
    <div
      ref={trilho}
      className={`cb-barra cb-barra--${emPe ? 'em-pe' : 'deitada'}${destacado ? ' destacado' : ''}`}
      role="slider"
      tabIndex={0}
      aria-label="Brilho da tela"
      aria-orientation={emPe ? 'vertical' : 'horizontal'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={brilho}
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId)
        arrastando.current = true
        setBrilho(valorDoDedo(e))
      }}
      onPointerMove={(e) => arrastando.current && setBrilho(valorDoDedo(e))}
      onPointerUp={largar}
      onPointerCancel={() => (arrastando.current = false)}
      onKeyDown={tecla}
    >
      <span className="cb-barra__fill" style={emPe ? { height: `${brilho}%` } : { width: `${brilho}%` }} />
      <span className="cb-barra__sol" style={emPe ? undefined : { left: `${brilho}%`, transform: `translateX(-${brilho}%)` }}>
        <Sol />
      </span>
    </div>
  )

  // ---- o painel de cada marca ----
  const painel: Record<Marca, ReactNode> = {
    iphone: (
      <div className="cb-painel cb-painel--iphone">
        <div className="cb-bloco cb-conectar">
          <Tile ativo />
          <Tile ativo />
          <Tile />
          <Tile ativo />
        </div>
        <div className="cb-bloco cb-midia">
          <span>Não está tocando</span>
        </div>
        <div className="cb-pequenos">
          <Tile />
          <Tile />
          <Tile cls="cb-tile--largo">Foco</Tile>
        </div>
        <div className="cb-controle">{barra}</div>
        <div className="cb-controle cb-controle--falso" aria-hidden="true">
          <span className="cb-barra cb-barra--em-pe">
            <span className="cb-barra__fill" style={{ height: '55%' }} />
          </span>
        </div>
      </div>
    ),
    xiaomi: (
      <div className="cb-painel cb-painel--xiaomi">
        <div className="cb-xcartoes">
          <Tile ativo cls="cb-tile--largo">
            Wi-Fi
          </Tile>
          <Tile cls="cb-tile--largo">Dados móveis</Tile>
        </div>
        <div className="cb-controle">{barra}</div>
        <div className="cb-controle cb-controle--falso" aria-hidden="true">
          <span className="cb-barra cb-barra--em-pe">
            <span className="cb-barra__fill" style={{ height: '60%' }} />
          </span>
        </div>
        <div className="cb-xgrade">
          <Tile ativo />
          <Tile />
          <Tile />
          <Tile ativo />
          <Tile />
          <Tile />
          <Tile />
          <Tile />
        </div>
      </div>
    ),
    samsung: (
      <div className="cb-painel cb-painel--samsung">
        <p className="cb-data">
          <strong>09:41</strong>
          <span>seg., 16 de nov.</span>
        </p>
        <div className="cb-grade">
          <Tile ativo>Wi-Fi</Tile>
          <Tile>Som</Tile>
          <Tile ativo>Bluetooth</Tile>
          <Tile>Avião</Tile>
          <Tile>Lanterna</Tile>
          <Tile>Rotação</Tile>
        </div>
        <div className="cb-linha-brilho">{barra}</div>
      </div>
    ),
    motorola: (
      <div className="cb-painel cb-painel--motorola">
        <p className="cb-data">
          <span>seg., 16 de nov.</span>
        </p>
        <div className="cb-linha-brilho">{barra}</div>
        <div className="cb-grade cb-grade--2">
          <Tile ativo>Internet</Tile>
          <Tile ativo>Bluetooth</Tile>
          <Tile>Lanterna</Tile>
          <Tile>Não perturbe</Tile>
        </div>
      </div>
    ),
  }

  // Motorola, 1º deslize: só os avisos (e uma alça para deslizar de novo)
  const avisos = (
    <div className="cb-painel cb-painel--avisos">
      <div className="cb-grade cb-grade--2 cb-grade--compacta">
        <Tile ativo>Internet</Tile>
        <Tile ativo>Bluetooth</Tile>
      </div>
      <p className="cb-aviso-cartao">
        <strong>💬 Ana</strong>
        <span>Bom dia, vó! Já acordou?</span>
      </p>
      <p className="cb-aviso-dica">Não apareceu o brilho? Deslize de novo ↓</p>
    </div>
  )

  const claridade = 0.35 + (0.65 * brilho) / 100
  const painelAberto = etapa === 'ajustar'

  return (
    <div className={`cel-bril cel-bril--${marca}`}>
      <div className="cb-marcas" role="group" aria-label="Qual é a marca do seu celular?">
        {marcas.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={marca === m.id}
            className={marca === m.id ? 'ativo' : ''}
            onClick={() => escolherMarca(m.id)}
          >
            {m.nome}
          </button>
        ))}
      </div>

      <p className="cb-legenda" aria-live="polite">
        <strong>{etapa === 'puxar' ? '1. Deslize para baixo' : etapa === 'ajustar' ? '2.' : '3.'}</strong>{' '}
        {etapa === 'puxar' ? jeito.gesto : etapa === 'ajustar' ? jeito.barra : 'Toque na mensagem da Ana'}
      </p>

      <div className="cb-celular">
        <span className="cb-lado cb-lado--dir" aria-hidden="true" />
        <span className="cb-lado cb-lado--esq" aria-hidden="true" />
        <div className="cb-tela">
          <BarraStatus />
          <span className="cb-furo" aria-hidden="true" />

          <div className="cb-papel" aria-hidden="true" />
          <div className="cb-mensagem">
            {etapa === 'ler' ? (
              <button
                type="button"
                className={`cb-aviso-cartao cb-aviso-cartao--botao${destacado ? ' destacado' : ''}`}
                onClick={aoAcertar}
              >
                <strong>💬 Ana</strong>
                <span>Bom dia, vó! Já acordou?</span>
              </button>
            ) : (
              <p className="cb-aviso-cartao">
                <strong>💬 Ana</strong>
                <span>Bom dia, vó! Já acordou?</span>
              </p>
            )}
          </div>

          <span className="cb-escuro" style={{ opacity: 1 - claridade }} aria-hidden="true" />

          {etapa === 'puxar' && !soAvisos && (
            <>
              <span className={`cb-seta cb-seta--${jeito.canto}`} aria-hidden="true" />
              {bolinha(`cb-bolinha--${jeito.canto}`)}
            </>
          )}
          {etapa === 'puxar' && soAvisos && (
            <>
              {avisos}
              {bolinha('cb-bolinha--baixo')}
            </>
          )}
          {painelAberto && painel[marca]}
        </div>
      </div>
    </div>
  )
}
