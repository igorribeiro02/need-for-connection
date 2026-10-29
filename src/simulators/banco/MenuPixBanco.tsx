import { useState } from 'react'
import type { BancoConfig, Passo } from '../../core/engine/stepTypes'
import { CampoDigitar } from '../celular/CampoDigitar'

type Props = {
  banco: BancoConfig
  passo: Passo
  destacar: boolean
  aoResponder: (resposta: string) => void
}

/**
 * Tela do Pix copiada da estrutura do app do banco: faixa colorida com seta e "Pix", pergunta, campo da chave,
 * botões de apoio e atalhos de outros serviços. Só o campo da chave funciona; os outros botões avisam isso com calma.
 */
export function MenuPixBanco({ banco, passo, destacar, aoResponder }: Props) {
  const menu = banco.fluxo.menuPix!
  const [aviso, setAviso] = useState('')
  const inerte = (rotulo: string) => setAviso(`"${rotulo}" não funciona neste exercício. Use a caixa de cima, onde se escreve a chave.`)

  const botao = (b: { rotulo: string; icone: string }, classe: string) => (
    <button key={b.rotulo} type="button" className={classe} onClick={() => inerte(b.rotulo)}>
      <span className="menupix__icone" aria-hidden="true">
        {b.icone}
      </span>
      <span>{b.rotulo}</span>
    </button>
  )

  return (
    <div className="menupix">
      <div className="menupix__topo">
        <span className="menupix__voltar" aria-hidden="true">
          ←
        </span>
        <span>Pix</span>
        <small>Banco simulado</small>
      </div>

      <div className="menupix__corpo">
        <h2 className="menupix__pergunta">{menu.titulo}</h2>

        <div className="menupix__campo">
          <CampoDigitar key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder} />
          {menu.dicaCampo && <p className="menupix__dica">{menu.dicaCampo}</p>}
        </div>

        <div className="menupix__botoes">{menu.botoes.map((b) => botao(b, 'menupix__apoio'))}</div>

        {menu.mais && (
          <>
            {menu.secaoMais && <h3 className="menupix__secao">{menu.secaoMais}</h3>}
            <div className="menupix__linha">{menu.mais.map((b) => botao(b, 'menupix__cartao'))}</div>
          </>
        )}

        {menu.outros && (
          <>
            {menu.secaoOutros && <h3 className="menupix__secao">{menu.secaoOutros}</h3>}
            <div className="menupix__grade">{menu.outros.map((b) => botao(b, 'menupix__cartao'))}</div>
          </>
        )}

        <p className="menupix__aviso" role="status" aria-live="polite">
          {aviso}
        </p>
      </div>
    </div>
  )
}
