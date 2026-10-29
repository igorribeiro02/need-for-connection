import type { CSSProperties } from 'react'
import type { Passo } from '../../core/engine/stepTypes'

type Props = {
  passo: Passo
  nome: string
  destacar: boolean
  aoResponder: (resposta: string) => void
}

/**
 * Tela inicial de um app de banco: faixa colorida com saudação e saldo, grade de atalhos
 * e lista de serviços. Estrutura baseada numa captura real do aplicativo da Caixa (Caixa Tem).
 * Os ícones do alto (sino, busca...) são só enfeite: nesta simulação só os botões do exercício funcionam.
 */
export function InicioBanco({ passo, nome, destacar, aoResponder }: Props) {
  const tela = passo.tela
  const todos = passo.elementos ?? []
  const pilula = todos.find((e) => e.grupo === 'saldo')
  const atalhos = todos.filter((e) => e.grupo === 'atalho')
  const servicos = todos.filter((e) => e.grupo === 'servico')
  const marca = (id: string) => (destacar && id === passo.alvo ? ' destacado' : '')

  return (
    <div className="inicio">
      <div className="inicio__topo">
        <div className="inicio__barra">
          <strong>Banco simulado</strong>
          <span aria-hidden="true">🔔 ▶ 🔍 ⋮</span>
        </div>
        <div className="inicio__ola">
          <span className="inicio__avatar" aria-hidden="true">
            🙂
          </span>
          <div>
            <strong>Olá, {nome} ⌄</strong>
            <span>Conta 12345-0</span>
          </div>
        </div>
        <div className="inicio__saldo">
          {pilula ? (
            <>
              <span aria-hidden="true">R$</span>
              <button type="button" className={`inicio__pilula${marca(pilula.id)}`} onClick={() => aoResponder(pilula.id)}>
                {pilula.rotulo}
              </button>
              <span aria-hidden="true">👁</span>
            </>
          ) : (
            <>
              <span>Saldo</span>
              <strong>{tela?.saldo}</strong>
              <span aria-hidden="true">👁</span>
            </>
          )}
        </div>
      </div>

      <h3 className="inicio__secao">{tela?.inicio?.secaoAtalhos}</h3>
      <div className="inicio__grade" style={{ '--colunas-atalhos': tela?.inicio?.colunas ?? 3 } as CSSProperties}>
        {atalhos.map((a) => (
          <button key={`a-${a.id}-${a.rotulo}`} type="button" className={`inicio__atalho${marca(a.id)}`} onClick={() => aoResponder(a.id)}>
            <span className="inicio__icone" aria-hidden="true">
              {a.icone}
            </span>
            <span>{a.rotulo}</span>
          </button>
        ))}
      </div>

      {servicos.length > 0 && (
        <>
          <h3 className="inicio__secao">{tela?.inicio?.secaoServicos}</h3>
          <ul className="inicio__lista">
            {servicos.map((v) => (
              <li key={`s-${v.id}-${v.rotulo}`}>
                <button type="button" className={`inicio__servico${marca(v.id)}`} onClick={() => aoResponder(v.id)}>
                  <span className="inicio__icone" aria-hidden="true">
                    {v.icone}
                  </span>
                  <span>
                    <strong>{v.rotulo}</strong>
                    <small>{v.detalhe}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
