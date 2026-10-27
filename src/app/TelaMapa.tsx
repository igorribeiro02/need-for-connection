import { useJogo } from './JogoContext'
import { PainelMundo } from './PainelMundo'
import { mapaDosMundos, mundoEm } from '../content/worldMap'
import { mundos } from '../content/worlds'
import { objetoEm, posicaoDoObjeto, posicaoInicial, type Posicao } from '../core/world/grid'
import { mundoConcluido, mundoLiberado } from '../core/world/unlock'
import { BarraAjustes } from '../features/settings/BarraAjustes'
import { Direcional } from '../world/Direcional'
import { MapaGrade } from '../world/MapaGrade'
import { useMovimento } from '../world/useMovimento'
import type { DadosPerfil } from '../core/progress/schema'

type Props = {
  posicao: Posicao | null
  definirPosicao: (p: Posicao) => void
  aoAbrirFase: (faseId: string, revisao: boolean) => void
  aoAbrirBackup: () => void
}

/** Quem ainda não terminou o Mundo 0 começa de pé na entrada dele; os outros, na praça. */
function posicaoDePartida(dados: DadosPerfil): Posicao {
  const mundo0 = mundos.find((m) => m.numero === 0)
  const entrada = posicaoDoObjeto(mapaDosMundos, 'mundo-0')
  if (mundo0 && entrada && !mundoConcluido(mundo0, dados.fases)) return entrada
  return posicaoInicial(mapaDosMundos)
}

export function TelaMapa({ posicao, definirPosicao, aoAbrirFase, aoAbrirBackup }: Props) {
  const { dados, sair, salvouNoAparelho, atualizarPreferencias } = useJogo()
  const pos = posicao ?? (dados ? posicaoDePartida(dados) : { x: 0, y: 0 })
  const { mover, irPara } = useMovimento(mapaDosMundos, pos, definirPosicao)
  if (!dados) return null

  const modo = dados.preferencias.modoMapa
  const numeroAqui = mundoEm(pos)
  const mundoAqui = mundos.find((m) => m.numero === numeroAqui)
  const aqui = objetoEm(mapaDosMundos, pos)

  const bloqueados = mundos.filter((m) => !mundoLiberado(m.numero, mundos, dados.fases)).map((m) => `mundo-${m.numero}`)
  const concluidos = mundos.filter((m) => mundoConcluido(m, dados.fases)).map((m) => `mundo-${m.numero}`)

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

      <div className="linha" role="group" aria-label="Como ver os mundos" style={{ marginBottom: 'var(--espaco)' }}>
        <button
          className={`botao${modo === 'mapa' ? '' : ' botao--secundario'}`}
          aria-pressed={modo === 'mapa'}
          onClick={() => atualizarPreferencias({ modoMapa: 'mapa' })}
        >
          🗺️ Mapa
        </button>
        <button
          className={`botao${modo === 'lista' ? '' : ' botao--secundario'}`}
          aria-pressed={modo === 'lista'}
          onClick={() => atualizarPreferencias({ modoMapa: 'lista' })}
        >
          📋 Lista
        </button>
      </div>

      {modo === 'mapa' ? (
        <>
          <p className="ajuda-campo">
            Ande com as setas do teclado, com os botões abaixo, ou toque no lugar para onde quer ir. Cada prédio é um mundo.
          </p>
          <MapaGrade
            mapa={mapaDosMundos}
            posicao={pos}
            avatar={dados.perfil.avatar}
            descricao="Mapa dos mundos. Use as setas do teclado para andar até a entrada de um mundo."
            anuncio={aqui ? `Você chegou na entrada de: ${aqui.rotulo}` : ''}
            aoMover={mover}
            aoIrPara={irPara}
            bloqueados={bloqueados}
            concluidos={concluidos}
          />
          <Direcional aoMover={mover} />
          {mundoAqui ? (
            <PainelMundo mundo={mundoAqui} dados={dados} aoAbrirFase={aoAbrirFase} />
          ) : (
            <p className="cartao">Você está na praça. Ande até um prédio para ver o que há lá.</p>
          )}
        </>
      ) : (
        mundos.map((m) => <PainelMundo key={m.numero} mundo={m} dados={dados} aoAbrirFase={aoAbrirFase} />)
      )}

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
