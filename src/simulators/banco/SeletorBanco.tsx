import { bancos, buscarBanco } from '../../content/banks'
import { BarraAjustes } from '../../features/settings/BarraAjustes'

type Props = {
  tituloFase: string
  preferido?: string
  aoEscolher: (bancoId: string) => void
  aoVoltar: () => void
}

export function SeletorBanco({ tituloFase, preferido, aoEscolher, aoVoltar }: Props) {
  const atual = buscarBanco(preferido)

  return (
    <main className="pagina">
      <BarraAjustes />
      <h1>{tituloFase}</h1>
      <h2>Qual é o seu banco?</h2>
      <p>Escolha o banco que você usa. Vamos treinar com um aplicativo parecido com o seu.</p>

      {atual && (
        <p>
          <button className="botao" onClick={() => aoEscolher(atual.id)}>
            Continuar com {atual.nomeNaLista}
          </button>
        </p>
      )}

      <div className="banco__lista" role="group" aria-label="Lista de bancos">
        {bancos.map((b) => (
          <button key={b.id} className="botao botao--secundario" onClick={() => aoEscolher(b.id)}>
            {b.nomeNaLista}
          </button>
        ))}
      </div>
      <p className="ajuda-campo">Não achou o seu? Escolha qualquer um: os passos são parecidos.</p>

      <button className="botao botao--secundario" onClick={aoVoltar}>
        Voltar ao mapa
      </button>
    </main>
  )
}
