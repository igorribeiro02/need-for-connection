import type { PainelCelular } from '../../core/engine/stepTypes'

/** Cartão do celular simples: ajustes com medidor, pop-up, mensagem. Só desenha; quem responde são os botões. */
export function PainelDoCelular({ painel }: { painel: PainelCelular }) {
  const { medidor } = painel
  return (
    <div className={`painel-celular painel-celular--${painel.estilo ?? 'normal'}`}>
      {painel.titulo && <p className="painel-celular__titulo">{painel.titulo}</p>}
      {painel.linhas?.map((l) => (
        <p key={l} className="painel-celular__linha">
          {l}
        </p>
      ))}
      {medidor && (
        <div className="painel-celular__medidor" role="img" aria-label={`${medidor.rotulo}: ${medidor.nivel} de ${medidor.max}`}>
          <span className="painel-celular__medidor-rotulo">{medidor.rotulo}</span>
          <span className="painel-celular__barras" aria-hidden="true">
            {Array.from({ length: medidor.max }, (_, k) => (
              <span key={k} className={k < medidor.nivel ? 'cheia' : ''} />
            ))}
          </span>
        </div>
      )}
    </div>
  )
}
