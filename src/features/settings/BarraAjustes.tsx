import { useJogo } from '../../app/JogoContext'

const MIN = 1
const MAX = 2
const PASSO = 0.25

export function BarraAjustes() {
  const { dados, atualizarPreferencias } = useJogo()
  if (!dados) return null
  const { escalaFonte, altoContraste } = dados.preferencias

  return (
    <div className="linha" role="group" aria-label="Ajustes de leitura" style={{ marginBottom: 'var(--espaco)' }}>
      <button
        className="botao botao--secundario"
        onClick={() => atualizarPreferencias({ escalaFonte: Math.max(MIN, escalaFonte - PASSO) })}
        disabled={escalaFonte <= MIN}
        aria-label="Diminuir letra"
      >
        A−
      </button>
      <button
        className="botao botao--secundario"
        onClick={() => atualizarPreferencias({ escalaFonte: Math.min(MAX, escalaFonte + PASSO) })}
        disabled={escalaFonte >= MAX}
        aria-label="Aumentar letra"
      >
        A+
      </button>
      <button
        className="botao botao--secundario"
        aria-pressed={altoContraste}
        onClick={() => atualizarPreferencias({ altoContraste: !altoContraste })}
      >
        Alto contraste: {altoContraste ? 'ligado' : 'desligado'}
      </button>
    </div>
  )
}
