import type { CSSProperties } from 'react'
import type { BancoConfig, Passo } from '../../core/engine/stepTypes'
import { CampoDigitar } from '../celular/CampoDigitar'
import { TecladoSenha } from './TecladoSenha'

type Props = {
  banco: BancoConfig
  passo: Passo
  destacar: boolean
  aoResponder: (resposta: string) => void
}

/** Aplicativo de banco simulado. A tela de cada passo vem pronta do gerador (passo.tela e passo.elementos). */
export function TelaBanco({ banco, passo, destacar, aoResponder }: Props) {
  const tela = passo.tela
  const senha = passo.tipo === 'digitar' && passo.teclado === 'senha'

  return (
    <div
      className="celular banco"
      role="group"
      aria-label="Tela do aplicativo de banco (simulação)"
      style={{ '--banco-cor': banco.tema.corPrincipal } as CSSProperties}
    >
      <p className="faixa-simulacao">
        Simulação no estilo do aplicativo {banco.nomeNaLista === 'Outro banco / não sei' ? 'de um banco' : `do ${banco.nomeNaLista}`}. Nada
        aqui é de verdade.
      </p>
      <div className="banco__topo">Banco simulado</div>

      {tela && <h2 className="banco__titulo">{tela.titulo}</h2>}
      {tela?.linhas?.map((l) => (
        <p key={l} className="banco__linha">
          {l}
        </p>
      ))}

      {(passo.tipo === 'tocar' || passo.tipo === 'escolher') && (
        <div className="banco__lista">
          {(passo.elementos ?? []).map((el) => (
            <button
              key={el.id}
              type="button"
              className={`botao botao--banco${destacar && el.id === passo.alvo ? ' destacado' : ''}`}
              onClick={() => aoResponder(el.id)}
            >
              {el.rotulo}
            </button>
          ))}
        </div>
      )}

      {passo.tipo === 'digitar' && !senha && <CampoDigitar key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder} />}
      {senha && <TecladoSenha key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder} />}
    </div>
  )
}
