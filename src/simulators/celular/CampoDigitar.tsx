import { useState, type FormEvent, type ReactNode } from 'react'
import type { Passo } from '../../core/engine/stepTypes'

type Props = { passo: Passo; destacar?: boolean; aoResponder: (resposta: string) => void; children?: ReactNode }

const MODO: Record<NonNullable<Passo['teclado']>, 'text' | 'numeric' | 'email' | 'decimal'> = {
  texto: 'text',
  numero: 'numeric',
  email: 'email',
  valor: 'decimal',
  senha: 'numeric',
}

function primeiraResposta(passo: Passo): string {
  return Array.isArray(passo.esperado) ? (passo.esperado[0] ?? '') : (passo.esperado ?? '')
}

export function CampoDigitar({ passo, destacar = false, aoResponder, children }: Props) {
  const [texto, setTexto] = useState(passo.valorInicial ?? '')

  function enviar(e: FormEvent) {
    e.preventDefault()
    aoResponder(texto)
  }

  return (
    <form onSubmit={enviar}>
      <div className="campo">
        <label htmlFor="campo-digitar">{passo.rotuloCampo ?? 'Escreva aqui'}</label>
        <input
          id="campo-digitar"
          className={destacar ? 'destacado' : undefined}
          value={texto}
          placeholder={passo.teclado === 'valor' ? 'R$ 0,00' : undefined}
          onChange={(e) => setTexto(e.target.value)}
          inputMode={MODO[passo.teclado ?? 'texto']}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        {destacar && <p className="ajuda-campo">Escreva: {primeiraResposta(passo)}</p>}
      </div>
      {children}
      <button type="submit" className="botao">
        {passo.rotuloBotao ?? 'Pronto'}
      </button>
    </form>
  )
}
