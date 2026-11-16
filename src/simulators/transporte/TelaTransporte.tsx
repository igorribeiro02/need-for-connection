import type { AppTransporte, Passo } from '../../core/engine/stepTypes'
import { TelaApp } from '../banco/TelaApp'

type Props = {
  app: AppTransporte
  passo: Passo
  destacar: boolean
  nome: string
  aoResponder: (resposta: string) => void
  aoVoltarPasso: () => void
}

/** Aplicativo de transporte simulado (Uber, 99). Usa o mesmo desenhador de telas por blocos dos bancos. */
export function TelaTransporte({ app, passo, destacar, nome, aoResponder, aoVoltarPasso }: Props) {
  return (
    <div className="celular banco" role="group" aria-label={`Tela do aplicativo ${app.nome}`}>
      {passo.tela?.layout === 'app' && passo.tela.app && (
        <TelaApp tema={app.tema} passo={passo} nome={nome} destacar={destacar} aoResponder={aoResponder} aoVoltarPasso={aoVoltarPasso} />
      )}
    </div>
  )
}
