import { useEffect, useMemo, useState } from 'react'
import { useJogo } from './JogoContext'
import { buscarBanco } from '../content/banks'
import { personagens } from '../content/story/personagens'
import { buscarFase, mundos, resolverFase } from '../content/worlds'
import { estrelas, iniciar, mostrarOnde, passoAtual, pedirDica, responder, voltarPasso } from '../core/engine/phaseRunner'
import type { EstadoFase } from '../core/engine/phaseRunner'
import type { Fase } from '../core/engine/stepTypes'
import { GuiaCelularReal } from '../features/guiaCelular/GuiaCelularReal'
import { falar, narracaoDisponivel } from '../features/settings/narracao'
import { BarraAjustes } from '../features/settings/BarraAjustes'
import { CenaHistoria } from '../features/historia/CenaHistoria'
import { cenaVista, finalPendente, idAbertura, idFechamento, idFinal, marcarCena } from '../core/story/historia'
import { SeletorBanco } from '../simulators/banco/SeletorBanco'
import { TelaBanco } from '../simulators/banco/TelaBanco'
import { TelaTransporte } from '../simulators/transporte/TelaTransporte'
import { TelaCelular } from '../simulators/celular/TelaCelular'

/** Quem quer voltar um passo dentro da fase (botão voltar do celular). Devolve false quando não há passo anterior. */
export type VoltarInterno = () => boolean

type Props = { faseId: string; revisao: boolean; aoVoltar: () => void; registrarVoltar: (fn: VoltarInterno | null) => void }

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Antes de começar, fases de banco pedem o banco; depois entra o exercício. */
export function TelaFase({ faseId, revisao, aoVoltar, registrarVoltar }: Props) {
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
      registrarVoltar={registrarVoltar}
      aoTrocarBanco={() => setBancoId(null)}
    />
  )
}

type PropsExercicio = {
  base: Fase
  bancoId: string | null
  revisao: boolean
  aoVoltar: () => void
  registrarVoltar: (fn: VoltarInterno | null) => void
  aoTrocarBanco: () => void
}

function Exercicio({ base, bancoId, revisao, aoVoltar, registrarVoltar, aoTrocarBanco }: PropsExercicio) {
  const { dados, atualizar, atualizarFase, atualizarPreferencias } = useJogo()
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

  // história: cena antes do exercício, cena depois e (se o mundo acabou) a cena final do mundo
  const historia = base.historia
  const nome = dados?.perfil.nome ?? ''
  const mundo = mundos.find((m) => m.numero === fase.mundo)
  const lugar = mundo ? `Fase ${mundo.numero} · ${mundo.dia ? `${mundo.dia} · ` : ''}${mundo.titulo}` : undefined
  const [cena, setCena] = useState<'abertura' | 'exercicio'>(() =>
    historia && dados && !revisao && !cenaVista(dados, idAbertura(fase.id)) ? 'abertura' : 'exercicio',
  )
  const [mostrarFinal, setMostrarFinal] = useState(false)
  const [ajustesAbertos, setAjustesAbertos] = useState(false)
  const vistar = (id: string) => atualizar((d) => ({ ...d, cenasVistas: marcarCena(d.cenasVistas, id) }))

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

  const temPassoAnterior = estado.indice > 0 && !estado.concluida
  const voltarUm = () => aplicar(voltarPasso(fase, estado))
  // seta ← dentro do app simulado: volta um passo; no primeiro passo, volta ao mapa
  const voltarDoApp = () => (temPassoAnterior ? voltarUm() : aoVoltar())

  // o botão voltar do celular (ou do navegador) também volta um passo antes de sair da fase
  useEffect(() => {
    registrarVoltar(() => {
      if (!temPassoAnterior) return false
      voltarUm()
      return true
    })
    return () => registrarVoltar(null)
  })

  // no celular a tela rola: cada passo novo começa no alto, e um aviso novo volta a mostrar o guia
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [estado.indice, cena])
  const avisoAtual = estado.aviso
  useEffect(() => {
    if (!avisoAtual) return
    const guia = document.querySelector('.guia')
    if (guia && guia.getBoundingClientRect().top < 0) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [avisoAtual])

  if (historia && cena === 'abertura' && !estado.concluida) {
    const comecar = () => {
      vistar(idAbertura(fase.id))
      setCena('exercicio')
    }
    return <CenaHistoria falas={historia.abertura} nome={nome} lugar={lugar} rotuloFim="Vamos lá!" aoFim={comecar} aoPular={comecar} />
  }

  if (estado.concluida) {
    const n = estrelasFinais(estado)
    if (historia && dados && !cenaVista(dados, idFechamento(fase.id))) {
      return (
        <CenaHistoria
          falas={historia.fechamento}
          nome={nome}
          lugar={lugar}
          premio={historia.premio}
          rotuloFim="Continuar"
          aoFim={() => vistar(idFechamento(fase.id))}
        />
      )
    }
    const final = dados && mundo && finalPendente(mundo, dados)
    if (final && mundo?.historiaFinal && mostrarFinal) {
      return (
        <CenaHistoria
          falas={mundo.historiaFinal.falas}
          nome={nome}
          lugar={lugar}
          premio={mundo.historiaFinal.premio}
          rotuloFim="Voltar ao mapa"
          aoFim={() => {
            vistar(idFinal(mundo.numero))
            aoVoltar()
          }}
        />
      )
    }
    return (
      <main className="pagina pagina--fase">
        <div className="vitoria">
          <div className="vitoria__selo" aria-hidden="true">
            ✓
          </div>
          <h1>Você conseguiu!</h1>
          <div className="mensagem mensagem--ok" role="status">
            <p className="vitoria__estrelas" aria-label={`${n} estrelas`}>
              {'★'.repeat(n) + '☆'.repeat(3 - n)}
            </p>
            <p>Você terminou &quot;{fase.titulo}&quot;. Quando quiser, volte para rever.</p>
            {n < 3 && <p>Para ganhar mais estrelas, tente de novo com menos ajuda. Sem pressa.</p>}
          </div>
        </div>
        <h2>Para lembrar depois</h2>
        <ol>
          {fase.passos.map((p) => (
            <li key={p.id}>{p.lembrete}</li>
          ))}
        </ol>
        {historia && (
          <div className="premio" role="status">
            <span className="premio__emoji" aria-hidden="true">
              {historia.premio.emoji}
            </span>
            <div>
              <p className="premio__rotulo">Página do álbum</p>
              <p className="premio__titulo">{historia.premio.titulo}</p>
            </div>
          </div>
        )}
        <button className="botao botao--grande" onClick={final ? () => setMostrarFinal(true) : aoVoltar}>
          {final ? 'Continuar a história' : 'Voltar ao mapa'}
        </button>
      </main>
    )
  }

  if (!passo) return null

  // Ajuda que se adapta: a última dica, o modo guiado ou 3 erros seguidos mostram onde tocar.
  const ultimaDica = passo.dicas.length > 0 && estado.dicasNoPasso >= passo.dicas.length
  const destacar = guiado || ultimaDica || estado.errosNoPasso >= 3
  const oferecerAjuda = estado.errosNoPasso >= 2 && !ultimaDica

  const responderApp = (r: string) => aplicar(responder(fase, estado, r))

  return (
    <main className="pagina pagina--fase atividade">
      <header className="atividade__topo">
        <button className="botao botao--secundario botao--pilula" onClick={aoVoltar}>
          ← Mapa
        </button>
        <div className="atividade__titulo">
          <strong>{fase.titulo}</strong>
        </div>
        <button
          className="botao botao--secundario botao--pilula"
          aria-expanded={ajustesAbertos}
          aria-controls="ajustes-atividade"
          aria-label="Ajustes"
          onClick={() => setAjustesAbertos(!ajustesAbertos)}
        >
          ⚙
        </button>
      </header>

      {ajustesAbertos && (
        <div id="ajustes-atividade" className="atividade__ajustes">
          <BarraAjustes />
          <button className="botao botao--secundario botao--pilula" aria-pressed={guiado} onClick={() => atualizarPreferencias({ guiado: !guiado })}>
            Modo guiado: {guiado ? 'ligado' : 'desligado'}
          </button>
          <p className="ajuda-campo">O modo guiado mostra sempre onde tocar. Quem termina uma atividade assim ganha 1 estrela.</p>
          {historia && (
            <button
              className="botao botao--secundario botao--pilula"
              onClick={() => {
                setAjustesAbertos(false)
                setCena('abertura')
              }}
            >
              Reler a história
            </button>
          )}
          {banco && (
            <button className="botao botao--secundario botao--pilula" onClick={aoTrocarBanco}>
              Trocar de banco ({banco.nomeNaLista})
            </button>
          )}
        </div>
      )}

      <div className="atividade__progresso" aria-live="polite">
        <span className="passo-rotulo">
          {mundo ? `Fase ${mundo.numero} · ` : ''}Passo {estado.indice + 1} de {fase.passos.length}
        </span>
        <div className="progresso-passos" aria-hidden="true">
          {fase.passos.map((p, k) => (
            <span key={p.id} className={k < estado.indice ? 'feito' : k === estado.indice ? 'atual' : ''} />
          ))}
        </div>
      </div>

      <div className="atividade__palco">
        <div className="guia" role="region" aria-label="Guia do passo">
          <div className="guia__lado">
            <span className="guia__rosto" aria-hidden="true">
              {historia ? personagens[historia.abertura[historia.abertura.length - 1].quem].emoji : '👵'}
            </span>
            {narracaoDisponivel() && (
              <button className="guia__ouvir" onClick={() => falar(passo.instrucao)} aria-label="Ouvir a instrução">
                <span aria-hidden="true">🔊</span>
                <span>Ouvir</span>
              </button>
            )}
          </div>
          <div className="guia__corpo">
            <p className="guia__texto">{passo.instrucao}</p>
            {estado.aviso && (
              <p className={`guia__aviso guia__aviso--${estado.aviso.tipo}`} role="status">
                {estado.aviso.texto}
              </p>
            )}
            {oferecerAjuda && (
              <button className="botao botao--pilula" onClick={() => aplicar(mostrarOnde(fase, estado))}>
                Me mostre onde tocar
              </button>
            )}
          </div>
        </div>

        {fase.simulador === 'banco' && banco ? (
          <TelaBanco banco={banco} passo={passo} destacar={destacar} nome={nome} aoResponder={responderApp} aoVoltarPasso={voltarDoApp} />
        ) : fase.aplicativo ? (
          <TelaTransporte app={fase.aplicativo} passo={passo} destacar={destacar} nome={nome} aoResponder={responderApp} aoVoltarPasso={voltarDoApp} />
        ) : (
          <TelaCelular fase={fase} passo={passo} destacar={destacar} avatar={dados?.perfil.avatar ?? '🙂'} aoResponder={responderApp} />
        )}

        {fase.guiaReal && <GuiaCelularReal tema={fase.guiaReal} />}
      </div>

      <div className="atividade__barra">
        <button className="botao" onClick={() => aplicar(pedirDica(fase, estado))}>
          💡 Preciso de uma dica
        </button>
        {temPassoAnterior && (
          <button className="botao botao--secundario" onClick={voltarUm}>
            ← Voltar um passo
          </button>
        )}
      </div>
    </main>
  )
}
