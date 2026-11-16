import type { Mundo } from '../core/engine/stepTypes'
import type { DadosPerfil } from '../core/progress/schema'
import { resumoMundo } from '../core/world/unlock'

type Props = {
  mundo: Mundo
  dados: DadosPerfil
  aoAbrirFase: (faseId: string, revisao: boolean) => void
}

/** Cartão de um mundo: mostra "em breve" ou a lista de fases de acesso livre. */
export function PainelMundo({ mundo, dados, aoAbrirFase }: Props) {
  const { concluidas, total } = resumoMundo(mundo, dados.fases)

  return (
    <section className="cartao" aria-label={`Mundo ${mundo.numero}: ${mundo.titulo}`}>
      <h2>
        Mundo {mundo.numero}: {mundo.titulo}
      </h2>
      <p>{mundo.descricao}</p>
      {mundo.fases.length === 0 ? (
        <p>
          <strong>Em breve.</strong>
        </p>
      ) : (
        <>
          <p className="ajuda-campo">
            {concluidas} de {total} fases concluídas
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
