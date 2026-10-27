import { useState, type FormEvent } from 'react'
import type { Passo } from '../../core/engine/stepTypes'

type Props = { passo: Passo; aoResponder: (resposta: string) => void }

const MODO: Record<NonNullable<Passo['teclado']>, 'text' | 'numeric' | 'email'> = {
  texto: 'text',
  numero: 'numeric',
  email: 'email',
}

export function CampoDigitar({ passo, aoResponder }: Props) {
  const [texto, setTexto] = useState(passo.valorInicial ?? '')

  function enviar(e: FormEvent) {
    e.preventDefault()
    aoResponder(texto)
  }

  return (
    <form onSubmit={enviar}>
      <div className="campo">
        <label htmlFor="campo-digitar">Escreva aqui</label>
        <input
          id="campo-digitar"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          inputMode={MODO[passo.teclado ?? 'texto']}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
      <button type="submit" className="botao">
        Pronto
      </button>
    </form>
  )
}
