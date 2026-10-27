import { useJogo } from './JogoContext'
import { mundos } from '../content/worlds'
import { BarraAjustes } from '../features/settings/BarraAjustes'

type Props = {
  aoAbrirFase: (faseId: string, revisao: boolean) => void
  aoAbrirBackup: () => void
}

export function TelaMapa({ aoAbrirFase, aoAbrirBackup }: Props) {
  const { dados, sair, salvouNoAparelho } = useJogo()
  if (!dados) return null

  return (
    <main className="pagina">
      <BarraAjustes />
      <h1>
        Olá, {dados.perfil.avatar} {dados.perfil.nome}!
      </h1>
      <p>Escolha um mundo para treinar. Não há pressa nem cronômetro.</p>

      {!salvouNoAparelho && (
        <div className="mensagem mensagem--erro" role="alert">
          Não consegui salvar o seu progresso neste aparelho. Use &quot;Guardar meu progresso&quot; para copiar um código.
        </div>
      )}

      {mundos.map((m) => (
        <section key={m.numero} className="cartao" aria-label={`Mundo ${m.numero}: ${m.titulo}`}>
          <h2>
            Mundo {m.numero}: {m.titulo}
          </h2>
          <p>{m.descricao}</p>
          {m.fases.length === 0 ? (
            <p>
              <strong>Em breve.</strong>
            </p>
          ) : (
            <div className="linha">
              {m.fases.map((f) => {
                const prog = dados.fases[f.id]
                const concluida = prog?.status === 'concluida'
                const andamento = prog?.status === 'em-andamento'
                return (
                  <button key={f.id} className="botao" onClick={() => aoAbrirFase(f.id, concluida)}>
                    {f.titulo}
                    {concluida && ` — ${'★'.repeat(prog.estrelas)} Rever`}
                    {andamento && ' — continuar'}
                  </button>
                )
              })}
            </div>
          )}
        </section>
      ))}

      <div className="linha">
        <button className="botao botao--secundario" onClick={aoAbrirBackup}>
          Guardar meu progresso
        </button>
        <button className="botao botao--secundario" onClick={sair}>
          Trocar de perfil
        </button>
      </div>
    </main>
  )
}
