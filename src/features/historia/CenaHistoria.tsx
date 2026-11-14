import { useState } from 'react'
import { personagens } from '../../content/story/personagens'
import type { Fala, Premio } from '../../core/engine/stepTypes'
import { textoDaFala } from '../../core/story/historia'
import { falar, narracaoDisponivel } from '../settings/narracao'
import { estiloPersonagem } from './estilo'

type PropsCena = {
  falas: Fala[]
  nome: string
  /** Linha pequena acima da cena: "Domingo · Chegada à vila". */
  lugar?: string
  /** Prêmio mostrado depois do último balão (cena de fechamento). */
  premio?: Premio
  /** Texto do botão no último balão. */
  rotuloFim: string
  aoFim: () => void
  /** Sem isso, não há botão de pular. */
  aoPular?: () => void
}

/** Cena de história: um balão por vez, sem tempo correndo. O botão fica sempre no mesmo lugar. */
export function CenaHistoria({ falas, nome, lugar, premio, rotuloFim, aoFim, aoPular }: PropsCena) {
  const [i, setI] = useState(0)
  const fala = falas[i]
  if (!fala) return null
  const p = personagens[fala.quem]
  const texto = textoDaFala(fala.texto, nome)
  const ultima = i === falas.length - 1

  return (
    <main className="pagina cena" style={estiloPersonagem(fala.quem)}>
      {lugar && <p className="cena__lugar">{lugar}</p>}
      <div className="cena__palco">
        <div className="cena__personagem">
          <span className="cena__rosto" aria-hidden="true">
            {p.emoji}
          </span>
          <div>
            <p className="cena__nome">{p.nome}</p>
            <p className="cena__papel">{p.papel}</p>
          </div>
        </div>
        <p className="balao" role="status" aria-live="polite">
          {texto}
        </p>
        {narracaoDisponivel() && (
          <div>
            <button className="botao botao--secundario botao--pilula" onClick={() => falar(texto)} aria-label="Ouvir a fala">
              🔊 Ouvir
            </button>
          </div>
        )}
        {ultima && premio && (
          <div className="premio" role="status">
            <span className="premio__emoji" aria-hidden="true">
              {premio.emoji}
            </span>
            <div>
              <p className="premio__rotulo">Nova página no seu álbum</p>
              <p className="premio__titulo">{premio.titulo}</p>
            </div>
          </div>
        )}
      </div>
      {falas.length > 1 && (
        <div className="cena__pontos" aria-label={`Fala ${i + 1} de ${falas.length}`}>
          {falas.map((_, k) => (
            <span key={k} className={`cena__ponto${k === i ? ' cena__ponto--atual' : ''}`} />
          ))}
        </div>
      )}
      <div className="cena__acoes">
        <button className="botao botao--grande" onClick={() => (ultima ? aoFim() : setI(i + 1))}>
          {ultima ? rotuloFim : 'Continuar'}
        </button>
        <div className="cena__rodape">
          {i > 0 ? (
            <button className="botao botao--secundario botao--pilula" onClick={() => setI(i - 1)}>
              ← Fala anterior
            </button>
          ) : (
            <span />
          )}
          {aoPular && !ultima && (
            <button className="botao botao--secundario botao--pilula" onClick={aoPular}>
              Pular história
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

type PropsFaixa = { fala: Fala; nome: string; aoReler: () => void }

/** Faixa que fica acima do exercício com a fala-chave da abertura. */
export function FaixaHistoria({ fala, nome, aoReler }: PropsFaixa) {
  const p = personagens[fala.quem]
  return (
    <div className="faixa-historia" style={estiloPersonagem(fala.quem)}>
      <span className="faixa-historia__rosto" aria-hidden="true">
        {p.emoji}
      </span>
      <div className="faixa-historia__texto">
        <p className="faixa-historia__fala">
          <span className="faixa-historia__quem">{p.nome}</span>
          {textoDaFala(fala.texto, nome)}
        </p>
        <button className="botao botao--secundario botao--pilula" onClick={aoReler}>
          Reler a história
        </button>
      </div>
    </div>
  )
}
