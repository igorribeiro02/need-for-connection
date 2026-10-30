import type { AppTransporte, Passo } from '../../core/engine/stepTypes'
import { TelaApp } from '../banco/TelaApp'

type Props = {
  app: AppTransporte
  passo: Passo
  destacar: boolean
  nome: string
  aoResponder: (resposta: string) => void
}

/** Aplicativo de transporte simulado (Uber, 99). Usa o mesmo desenhador de telas por blocos dos bancos. */
export function TelaTransporte({ app, passo, destacar, nome, aoResponder }: Props) {
  return (
    <div className="celular banco" role="group" aria-label={`Tela do aplicativo ${app.nome} (simulação)`}>
      <p className="faixa-simulacao">
        Simulação no estilo do app: {app.nome}. Nada aqui é de verdade, nenhum carro será chamado. Só funcionam os botões do exercício.
      </p>
      {passo.tela?.layout === 'app' && passo.tela.app && (
        <TelaApp tema={app.tema} seloTopo="App simulado" passo={passo} nome={nome} destacar={destacar} aoResponder={aoResponder} />
      )}
    </div>
  )
}
