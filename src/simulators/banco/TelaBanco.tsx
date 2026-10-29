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

      {tela?.saldo && (
        <div className="banco__saldo">
          <span>Saldo disponível</span>
          <strong>{tela.saldo}</strong>
        </div>
      )}

      {tela && <h2 className="banco__titulo">{tela.titulo}</h2>}
      {tela?.linhas?.map((l) => (
        <p key={l} className="banco__linha">
          {l}
        </p>
      ))}
      {tela?.resumo && (
        <dl className="banco__resumo">
          {tela.resumo.map((r) => (
            <div key={r.rotulo}>
              <dt>{r.rotulo}</dt>
              <dd>{r.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      {(passo.tipo === 'tocar' || passo.tipo === 'escolher') && (
        <div className={tela?.layout === 'grade' ? 'banco__grade' : 'banco__lista'}>
          {(passo.elementos ?? []).map((el) => {
            const marca = destacar && el.id === passo.alvo ? ' destacado' : ''
            return tela?.layout === 'grade' ? (
              <button key={el.id} type="button" className={`banco__atalho${marca}`} onClick={() => aoResponder(el.id)}>
                <span className="banco__icone" aria-hidden="true">
                  {el.icone ?? '•'}
                </span>
                <span>{el.rotulo}</span>
              </button>
            ) : (
              <button key={el.id} type="button" className={`botao botao--banco banco__item${marca}`} onClick={() => aoResponder(el.id)}>
                <span>
                  {el.icone && (
                    <span aria-hidden="true">{el.icone} </span>
                  )}
                  {el.rotulo}
                </span>
                <span aria-hidden="true">›</span>
              </button>
            )
          })}
        </div>
      )}

      {passo.tipo === 'digitar' && !senha && <CampoDigitar key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder} />}
      {senha && <TecladoSenha key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder} />}
    </div>
  )
}
