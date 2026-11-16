import { useState } from 'react'
import { AVISO_VARIA, guias, marcas, type Marca, type Tema } from '../../content/guias/celularReal'
import { DesenhoCelular } from './DesenhoCelular'

const CHAVE = 'nfc:v1:marca-celular'

export const EVENTO_MARCA = 'nfc-marca'

export function marcaSalva(): Marca {
  try {
    const m = localStorage.getItem(CHAVE)
    if (m && marcas.some((x) => x.id === m)) return m as Marca
  } catch {
    // sem armazenamento: tudo bem
  }
  return 'samsung'
}

/** Mostra, num desenho de celular, como fazer a tarefa com as mãos em cada marca. */
export function GuiaCelularReal({ tema }: { tema: Tema }) {
  const [marca, setMarca] = useState<Marca>(marcaSalva)
  const [aberto, setAberto] = useState(tema !== 'brilho')
  const guia = guias[tema][marca]

  const escolher = (m: Marca) => {
    setMarca(m)
    try {
      localStorage.setItem(CHAVE, m)
      window.dispatchEvent(new Event(EVENTO_MARCA))
    } catch {
      // ignora
    }
  }

  return (
    <section className="guia-real" aria-label="Como fazer no celular de verdade">
      <button type="button" className="guia-real__titulo" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
        <span aria-hidden="true">📱</span> Como fazer no meu celular de verdade <span aria-hidden="true">{aberto ? '▲' : '▼'}</span>
      </button>
      {aberto && (
        <div className="guia-real__corpo">
          <div className="guia-real__marcas" role="group" aria-label="Qual é a marca do seu celular?">
            {marcas.map((m) => (
              <button key={m.id} type="button" aria-pressed={marca === m.id} className={marca === m.id ? 'ativo' : ''} onClick={() => escolher(m.id)}>
                {m.nome}
              </button>
            ))}
          </div>
          <DesenhoCelular marca={marca} tema={tema} />
          <h3>{guia.titulo}</h3>
          <ol>
            {guia.passos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
          {guia.nota && <p className="guia-real__nota">💡 {guia.nota}</p>}
          <p className="guia-real__nota">{AVISO_VARIA}</p>
        </div>
      )}
    </section>
  )
}
