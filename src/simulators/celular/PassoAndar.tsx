import type { MapaDef, Posicao } from '../../core/world/grid'
import { objetoEm } from '../../core/world/grid'
import type { Passo } from '../../core/engine/stepTypes'
import { Direcional } from '../../world/Direcional'
import { MapaGrade } from '../../world/MapaGrade'
import { useMovimento } from '../../world/useMovimento'

type Props = {
  mapa: MapaDef
  passo: Passo
  posicao: Posicao
  definirPosicao: (p: Posicao) => void
  avatar: string
  destacar: boolean
  aoResponder: (resposta: string) => void
}

export function PassoAndar({ mapa, passo, posicao, definirPosicao, avatar, destacar, aoResponder }: Props) {
  const { mover, irPara } = useMovimento(mapa, posicao, definirPosicao)
  const aqui = objetoEm(mapa, posicao)
  const confirmar = () => aqui && aoResponder(aqui.id)

  return (
    <>
      <MapaGrade
        mapa={mapa}
        posicao={posicao}
        avatar={avatar}
        descricao="Mapa do exercício. Use as setas do teclado para andar."
        anuncio={aqui ? `Você chegou em: ${aqui.rotulo}` : ''}
        aoMover={mover}
        aoIrPara={irPara}
        aoConfirmar={confirmar}
        destaque={destacar ? passo.alvo : undefined}
      />
      <Direcional aoMover={mover} />
      <p role="status">{aqui ? `Você está sobre: ${aqui.emoji} ${aqui.rotulo}` : 'Ande até um dos objetos do mapa.'}</p>
      <button type="button" className="botao" disabled={!aqui} onClick={confirmar}>
        {aqui ? `${passo.acao ?? 'Escolher'}: ${aqui.rotulo}` : `${passo.acao ?? 'Escolher'} (chegue até um objeto)`}
      </button>
    </>
  )
}
