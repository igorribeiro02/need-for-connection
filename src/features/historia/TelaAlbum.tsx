import { mundos } from '../../content/worlds'
import { useJogo } from '../../app/JogoContext'
import { montarAlbum } from '../../core/story/historia'

/** Álbum da Ana: um prêmio por fase terminada, mais as silhuetas dos que ainda faltam. */
export function TelaAlbum({ aoVoltar }: { aoVoltar: () => void }) {
  const { dados } = useJogo()
  if (!dados) return null
  const paginas = montarAlbum(mundos, dados.fases, dados.cenasVistas)
  const ganhos = paginas.flatMap((p) => p.itens).filter((i) => i.ganho).length
  const total = paginas.flatMap((p) => p.itens).length

  return (
    <main className="pagina">
      <button className="botao botao--secundario botao--pilula" onClick={aoVoltar}>
        ← Voltar ao mapa
      </button>
      <h1>Álbum da Ana</h1>
      <p>
        {ganhos} de {total} páginas. Cada fase que você termina guarda uma lembrança da semana até a festa.
      </p>
      {paginas.map((pg) => (
        <section key={pg.mundo} className="album__pagina" aria-label={`Fase ${pg.mundo}: ${pg.tituloMundo}`}>
          <h2 className="album__titulo">
            Fase {pg.mundo} · {pg.tituloMundo}
          </h2>
          {pg.dia && <p className="album__dia">{pg.dia}</p>}
          <div className="album__grade">
            {pg.itens.map((it) => (
              <div key={it.id} className={`album__item${it.ganho ? '' : ' album__item--falta'}`}>
                <span className="album__emoji" aria-hidden="true">
                  {it.premio.emoji}
                </span>
                <span className="album__nome">{it.ganho ? it.premio.titulo : 'Ainda não ganhou'}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
