import { useMemo, useState } from 'react'
import { useJogo } from './JogoContext'
import { buscarBanco } from '../content/banks'
import { buscarFase, resolverFase } from '../content/worlds'
import { estrelas, iniciar, mostrarOnde, passoAtual, pedirDica, responder } from '../core/engine/phaseRunner'
import type { EstadoFase } from '../core/engine/phaseRunner'
import type { Fase } from '../core/engine/stepTypes'
import { falar, narracaoDisponivel } from '../features/settings/narracao'
import { BarraAjustes } from '../features/settings/BarraAjustes'
import { SeletorBanco } from '../simulators/banco/SeletorBanco'
import { TelaBanco } from '../simulators/banco/TelaBanco'
import { TelaTransporte } from '../simulators/transporte/TelaTransporte'
import { TelaCelular } from '../simulators/celular/TelaCelular'

type Props = { faseId: string; revisao: boolean; aoVoltar: () => void }

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Antes de começar, fases de banco pedem o banco; depois entra o exercício. */
export function TelaFase({ faseId, revisao, aoVoltar }: Props) {
  const { dados, atualizar } = useJogo()
  const base = buscarFase(faseId)
  const salvo = dados?.fases[faseId]
  const [bancoId, setBancoId] = useState<string | null>(() => (base?.precisaEscolherBanco && !revisao ? (salvo?.banco ?? null) : null))
  if (!base || !dados) return null

  if (base.precisaEscolherBanco && !buscarBanco(bancoId)) {
    return (
      <SeletorBanco
        tituloFase={base.titulo}
        preferido={dados.preferencias.bancoPreferido}
        aoVoltar={aoVoltar}
        aoEscolher={(id) => {
          atualizar((d) => {
            const atual = d.fases[base.id]
            // outro banco tem outros passos: recomeça o que estava em andamento
            const mesmo = atual?.banco === id
            const concluida = atual?.status === 'concluida'
            return {
              ...d,
              preferencias: { ...d.preferencias, bancoPreferido: id },
              fases: {
                ...d.fases,
                [base.id]: {
                  status: concluida ? 'concluida' : 'em-andamento',
                  estrelas: atual?.estrelas ?? 0,
                  banco: id,
                  ultimaPratica: hoje(),
                  passosConcluidos: mesmo || concluida ? (atual?.passosConcluidos ?? []) : [],
                  dicasUsadas: mesmo ? atual?.dicasUsadas : 0,
                },
              },
            }
          })
          setBancoId(id)
        }}
      />
    )
  }

  return (
    <Exercicio
      key={`${faseId}-${bancoId}-${revisao}`}
      base={base}
      bancoId={bancoId}
      revisao={revisao}
      aoVoltar={aoVoltar}
      aoTrocarBanco={() => setBancoId(null)}
    />
  )
}

type PropsExercicio = {
  base: Fase
  bancoId: string | null
  revisao: boolean
  aoVoltar: () => void
  aoTrocarBanco: () => void
}

function Exercicio({ base, bancoId, revisao, aoVoltar, aoTrocarBanco }: PropsExercicio) {
  const { dados, atualizarFase, atualizarPreferencias } = useJogo()
  const banco = buscarBanco(bancoId)
  const fase = useMemo(() => resolverFase(base, banco), [base, banco])
  const salvo = dados?.fases[fase.id]
  const guiado = dados?.preferencias.guiado ?? false

  // retoma do passo em que parou; em revisão começa do zero sem perder estrelas já ganhas
  const [estado, setEstado] = useState<EstadoFase>(() => {
    const retomar = !revisao && (!banco || salvo?.banco === banco.id)
    return retomar ? iniciar(fase, salvo?.passosConcluidos ?? [], salvo?.dicasUsadas ?? 0) : iniciar(fase, [])
  })

  const passo = passoAtual(fase, estado)

  function aplicar(novo: EstadoFase) {
    setEstado(novo)
    atualizarFase(fase.id, (atual) => {
      const jaConcluida = atual?.status === 'concluida'
      const estrelasNovas = novo.concluida ? estrelasFinais(novo) : 0
      return {
        status: novo.concluida || jaConcluida ? 'concluida' : 'em-andamento',
        // na revisão mantém a melhor nota; nunca diminui
        estrelas: Math.max(atual?.estrelas ?? 0, estrelasNovas) as 0 | 1 | 2 | 3,
        banco: banco?.id ?? atual?.banco,
        ultimaPratica: hoje(),
        passosConcluidos: revisao || jaConcluida ? (atual?.passosConcluidos ?? novo.concluidos) : novo.concluidos,
        dicasUsadas: revisao || jaConcluida ? atual?.dicasUsadas : novo.dicasTotais,
      }
    })
  }

  // modo guiado conta como ajuda: no máximo 1 estrela
  function estrelasFinais(e: EstadoFase): 1 | 2 | 3 {
    return guiado ? 1 : estrelas(e)
  }

  if (estado.concluida) {
    const n = estrelasFinais(estado)
    return (
      <main className="pagina">
        <h1>Fase concluída!</h1>
        <div className="mensagem mensagem--ok" role="status">
          <p aria-label={`${n} estrelas`}>{'★'.repeat(n) + '☆'.repeat(3 - n)}</p>
          <p>Você terminou &quot;{fase.titulo}&quot;. Quando quiser, volte para rever.</p>
          {n < 3 && <p>Para ganhar mais estrelas, tente de novo com menos ajuda. Sem pressa.</p>}
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

  // Ajuda que se adapta: a última dica, o modo guiado ou 3 erros seguidos mostram onde tocar.
  const ultimaDica = passo.dicas.length > 0 && estado.dicasNoPasso >= passo.dicas.length
  const destacar = guiado || ultimaDica || estado.errosNoPasso >= 3
  const oferecerAjuda = estado.errosNoPasso >= 2 && !ultimaDica

  return (
    <main className="pagina">
      <BarraAjustes />
      <h1>{fase.titulo}</h1>
      {banco && (
        <p className="ajuda-campo">
          Banco escolhido: {banco.nomeNaLista}.{' '}
          <button className="botao botao--secundario" onClick={aoTrocarBanco}>
            Trocar de banco
          </button>
        </p>
      )}
      {fase.cenario && <p className="cartao">{fase.cenario}</p>}

      <p aria-live="polite">
        Passo {estado.indice + 1} de {fase.passos.length}
      </p>
      <progress className="progresso" max={fase.passos.length} value={estado.indice} aria-hidden="true" />

      <div className="cartao">
        <p style={{ fontSize: '1.3rem', fontWeight: 600 }}>{passo.instrucao}</p>
        {narracaoDisponivel() && (
          <button className="botao botao--secundario" onClick={() => falar(passo.instrucao)}>
            🔊 Ouvir
          </button>
        )}
      </div>

      {fase.simulador === 'banco' && banco ? (
        <TelaBanco banco={banco} passo={passo} destacar={destacar} nome={dados?.perfil.nome ?? ''} aoResponder={(r) => aplicar(responder(fase, estado, r))} />
      ) : fase.simulador === 'transporte' && fase.aplicativo ? (
        <TelaTransporte app={fase.aplicativo} passo={passo} destacar={destacar} nome={dados?.perfil.nome ?? ''} aoResponder={(r) => aplicar(responder(fase, estado, r))} />
      ) : (
        <TelaCelular fase={fase} passo={passo} destacar={destacar} avatar={dados?.perfil.avatar ?? '🙂'} aoResponder={(r) => aplicar(responder(fase, estado, r))} />
      )}

      {estado.aviso && (
        <div className={`mensagem mensagem--${estado.aviso.tipo}`} role="status">
          {estado.aviso.texto}
        </div>
      )}

      {oferecerAjuda && (
        <div className="mensagem mensagem--dica" role="status">
          <p>Está difícil? Sem problema. Quer que eu mostre onde tocar?</p>
          <button className="botao" onClick={() => aplicar(mostrarOnde(fase, estado))}>
            Me mostre onde tocar
          </button>
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

      <div className="cartao" style={{ marginTop: 'var(--espaco)' }}>
        <button className="botao botao--secundario" aria-pressed={guiado} onClick={() => atualizarPreferencias({ guiado: !guiado })}>
          Modo guiado: {guiado ? 'ligado' : 'desligado'}
        </button>
        <p className="ajuda-campo">O modo guiado mostra sempre onde tocar. Quem termina uma fase assim ganha 1 estrela.</p>
      </div>
    </main>
  )
}
