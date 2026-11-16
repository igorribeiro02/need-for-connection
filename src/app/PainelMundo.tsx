import { mundos } from '../content/worlds'
import type { Mundo } from '../core/engine/stepTypes'
import type { DadosPerfil } from '../core/progress/schema'
import { pendenciasParaAbrir, resumoMundo } from '../core/world/unlock'

type Props = {
  mundo: Mundo
  dados: DadosPerfil
  aoAbrirFase: (faseId: string, revisao: boolean) => void
}

/** Cartão de um mundo: mostra se está bloqueado, "em breve" ou a lista de fases. */
export function PainelMundo({ mundo, dados, aoAbrirFase }: Props) {
  const pendentes = pendenciasParaAbrir(mundo.numero, mundos, dados.fases)
  const { concluidas, total } = resumoMundo(mundo, dados.fases)

  return (
    <section className="cartao" aria-label={`Fase ${mundo.numero}: ${mundo.titulo}`}>
      <h2>
        Fase {mundo.numero}: {mundo.titulo}
      </h2>
      {mundo.dia && <p className="ajuda-campo">{mundo.dia}</p>}
      <p>{mundo.descricao}</p>
      {pendentes.length > 0 ? (
        <p className="mensagem mensagem--dica">
          <strong>🔒 Ainda bloqueado.</strong> Termine primeiro: {pendentes.map((m) => `Fase ${m.numero} (${m.titulo})`).join(', ')}.
        </p>
      ) : mundo.fases.length === 0 ? (
        <p>
          <strong>Em breve.</strong>
        </p>
      ) : (
        <>
          <p className="ajuda-campo">
            {concluidas} de {total} atividades concluídas
          </p>
          <div className="linha">
            {mundo.fases.map((f) => {
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
        </>
      )}
    </section>
  )
}
