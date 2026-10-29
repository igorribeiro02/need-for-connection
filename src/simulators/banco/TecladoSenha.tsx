import { useState } from 'react'
import type { Passo } from '../../core/engine/stepTypes'

type Props = { passo: Passo; destacar: boolean; aoResponder: (resposta: string) => void }

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const MAXIMO = 6

/** Teclado numérico na tela, como nos aplicativos de banco. Os números ficam escondidos por bolinhas. */
export function TecladoSenha({ passo, destacar, aoResponder }: Props) {
  const [digitos, setDigitos] = useState('')
  const esperado = Array.isArray(passo.esperado) ? (passo.esperado[0] ?? '') : (passo.esperado ?? '')

  // última dica: mostra a próxima tecla certa (ou o apagar, se já errou)
  const certoAteAqui = esperado.startsWith(digitos)
  const proxima = !destacar ? undefined : !certoAteAqui ? 'apagar' : digitos.length < esperado.length ? esperado[digitos.length] : 'confirmar'
  const marca = (id: string) => (proxima === id ? ' destacado' : '')

  return (
    <div>
      <p className="senha__bolinhas" role="img" aria-label={`${digitos.length} números digitados`}>
        {Array.from({ length: MAXIMO }, (_, i) => (i < digitos.length ? '●' : '○')).join(' ')}
      </p>
      <div className="senha__teclas" role="group" aria-label="Teclado de números">
        {TECLAS.map((t) => (
          <button
            key={t}
            type="button"
            className={`botao botao--banco${marca(t)}`}
            onClick={() => digitos.length < MAXIMO && setDigitos(digitos + t)}
          >
            {t}
          </button>
        ))}
        <button type="button" className={`botao botao--secundario${marca('apagar')}`} aria-label="Apagar" onClick={() => setDigitos(digitos.slice(0, -1))}>
          ⌫
        </button>
        <button
          type="button"
          className={`botao botao--banco${marca('0')}`}
          onClick={() => digitos.length < MAXIMO && setDigitos(digitos + '0')}
        >
          0
        </button>
      </div>
      <button type="button" className={`botao botao--banco senha__confirmar${marca('confirmar')}`} onClick={() => aoResponder(digitos)}>
        {passo.rotuloBotao ?? 'Confirmar'}
      </button>
    </div>
  )
}
