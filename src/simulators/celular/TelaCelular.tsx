import { useState } from 'react'
import type { EstadoFase } from '../../core/engine/phaseRunner'
import type { Fase, Passo } from '../../core/engine/stepTypes'
import { posicaoInicial, type Posicao } from '../../core/world/grid'
import { CampoDigitar } from './CampoDigitar'
import { ListaDeslizante } from './ListaDeslizante'
import { PassoAndar } from './PassoAndar'

type Props = {
  fase: Fase
  passo: Passo
  estado: EstadoFase
  avatar: string
  aoResponder: (resposta: string) => void
}

/** Celular simulado: escolhe o que mostrar de acordo com o tipo do passo. */
export function TelaCelular({ fase, passo, estado, avatar, aoResponder }: Props) {
  // o personagem fica onde parou entre os passos da mesma fase
  const [posicao, definirPosicao] = useState<Posicao>(() => (fase.mapa ? posicaoInicial(fase.mapa) : { x: 0, y: 0 }))

  // a última dica mostra onde tocar
  const destacar = passo.dicas.length > 0 && estado.dicasNoPasso >= passo.dicas.length

  return (
    <div className="celular" role="group" aria-label="Tela do exercício (simulação)">
      <p className="faixa-simulacao">Simulação para treinar: nada aqui é de verdade.</p>

      {passo.tipo === 'digitar' && <CampoDigitar key={passo.id} passo={passo} aoResponder={aoResponder} />}

      {passo.tipo === 'deslizar' && <ListaDeslizante key={passo.id} passo={passo} aoResponder={aoResponder} />}

      {passo.tipo === 'andar' && fase.mapa && (
        <PassoAndar
          mapa={fase.mapa}
          passo={passo}
          posicao={posicao}
          definirPosicao={definirPosicao}
          avatar={avatar}
          destacar={destacar}
          aoResponder={aoResponder}
        />
      )}

      {(passo.tipo === 'tocar' || passo.tipo === 'escolher' || passo.tipo === 'julgar' || passo.tipo === 'arrastar') && (
        <div className="linha">
          {(passo.elementos ?? []).map((el) => (
            <button
              key={el.id}
              type="button"
              className={`botao${destacar && el.id === passo.alvo ? ' destacado' : ''}`}
              onClick={() => aoResponder(el.id)}
            >
              {el.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
