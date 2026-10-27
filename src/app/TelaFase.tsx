import { useMemo, useState } from 'react'
import { useJogo } from './JogoContext'
import { buscarFase } from '../content/worlds'
import { estrelas, iniciar, passoAtual, pedirDica, responder } from '../core/engine/phaseRunner'
import type { EstadoFase } from '../core/engine/phaseRunner'
import { falar, narracaoDisponivel } from '../features/settings/narracao'
import { BarraAjustes } from '../features/settings/BarraAjustes'

type Props = { faseId: string; revisao: boolean; aoVoltar: () => void }

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

export function TelaFase({ faseId, revisao, aoVoltar }: Props) {
  const { dados, atualizarFase } = useJogo()
  const fase = buscarFase(faseId)

  // retoma do passo em que parou; em revisão começa do zero sem perder estrelas já ganhas
  const [estado, setEstado] = useState<EstadoFase | null>(() => {
    if (!fase) return null
    const salvo = dados?.fases[fase.id]
    return revisao ? iniciar(fase, []) : iniciar(fase, salvo?.passosConcluidos ?? [], salvo?.dicasUsadas ?? 0)
  })

  const passo = useMemo(() => (fase && estado ? passoAtual(fase, estado) : undefined), [fase, estado])
  if (!fase || !estado) return null

  function aplicar(novo: EstadoFase) {
    setEstado(novo)
    if (!fase) return
    atualizarFase(fase.id, (atual) => {
      const jaConcluida = atual?.status === 'concluida'
      const estrelasNovas = novo.concluida ? estrelas(novo) : 0
      return {
        status: novo.concluida || jaConcluida ? 'concluida' : 'em-andamento',
        // na revisão mantém a melhor nota; nunca diminui
        estrelas: Math.max(atual?.estrelas ?? 0, estrelasNovas) as 0 | 1 | 2 | 3,
        banco: atual?.banco,
        ultimaPratica: hoje(),
        passosConcluidos: revisao || jaConcluida ? (atual?.passosConcluidos ?? novo.concluidos) : novo.concluidos,
        dicasUsadas: revisao || jaConcluida ? atual?.dicasUsadas : novo.dicasTotais,
      }
    })
  }

  if (estado.concluida) {
    const n = estrelas(estado)
    return (
      <main className="pagina">
        <h1>Fase concluída!</h1>
        <div className="mensagem mensagem--ok" role="status">
          <p aria-label={`${n} estrelas`}>{'★'.repeat(n) + '☆'.repeat(3 - n)}</p>
          <p>Você terminou &quot;{fase.titulo}&quot;. Quando quiser, volte para rever.</p>
        </div>
        <h2>Para lembrar depois</h2>
        <ol>
          {fase.passos.map((p) => (
            <li key={p.id}>{p.lembrete}</li>
          ))}
        </ol>
        <button className="botao" onClick={aoVoltar}>
          Voltar ao mapa
        </button>
      </main>
    )
  }

  if (!passo) return null

  return (
    <main className="pagina">
      <BarraAjustes />
      <h1>{fase.titulo}</h1>
      <p aria-live="polite">
        Passo {estado.indice + 1} de {fase.passos.length}
      </p>

      <div className="cartao">
        <p style={{ fontSize: '1.3rem', fontWeight: 600 }}>{passo.instrucao}</p>
        {narracaoDisponivel() && (
          <button className="botao botao--secundario" onClick={() => falar(passo.instrucao)}>
            🔊 Ouvir
          </button>
        )}
      </div>

      {/* Tela básica: simuladores específicos (banco, mensagens...) entram no lugar disto */}
      <div className="cartao" role="group" aria-label="Tela do exercício">
        <div className="linha">
          {(passo.elementos ?? []).map((el) => (
            <button key={el.id} className="botao" onClick={() => aplicar(responder(fase, estado, el.id))}>
              {el.rotulo}
            </button>
          ))}
        </div>
      </div>

      {estado.aviso && (
        <div className={`mensagem mensagem--${estado.aviso.tipo}`} role="status">
          {estado.aviso.texto}
        </div>
      )}

      <div className="linha">
        <button className="botao botao--secundario" onClick={() => aplicar(pedirDica(fase, estado))}>
          Preciso de uma dica
        </button>
        <button className="botao botao--secundario" onClick={aoVoltar}>
          Voltar ao mapa
        </button>
      </div>
    </main>
  )
}
