import { useState } from 'react'
import { useJogo } from '../../app/JogoContext'
import { exportarCodigo, importarCodigo } from '../../core/progress/backupCode'

export function TelaBackup({ aoVoltar }: { aoVoltar: () => void }) {
  const { dados, importar } = useJogo()
  const [colado, setColado] = useState('')
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)
  const codigo = dados ? exportarCodigo(dados) : ''

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setAviso({ tipo: 'ok', texto: 'Código copiado. Guarde em um lugar seguro, como uma conversa com você mesmo.' })
    } catch {
      setAviso({ tipo: 'erro', texto: 'Não consegui copiar sozinho. Selecione o texto e copie à mão.' })
    }
  }

  function recuperar() {
    const r = importarCodigo(colado)
    if (r.ok) {
      importar(r.dados)
      setAviso({ tipo: 'ok', texto: `Progresso de ${r.dados.perfil.nome} recuperado.` })
    } else if (r.motivo === 'incompleto') {
      setAviso({ tipo: 'erro', texto: 'O código parece estar cortado. Copie o texto inteiro e tente de novo.' })
    } else if (r.motivo === 'versao') {
      setAviso({ tipo: 'erro', texto: 'Este código é de uma versão mais nova do jogo.' })
    } else {
      setAviso({ tipo: 'erro', texto: 'Não entendi este código. Confira se copiou o texto completo.' })
    }
  }

  return (
    <main className="pagina">
      <h1>Guardar e recuperar meu progresso</h1>

      {dados && (
        <section className="cartao">
          <h2>Guardar</h2>
          <p>
            Se o navegador for limpo, o progresso some. Copie este código e guarde: com ele você recupera tudo.
          </p>
          <textarea readOnly rows={4} value={codigo} aria-label="Código do meu progresso" style={{ width: '100%', font: 'inherit' }} />
          <p>
            <button className="botao" onClick={copiar}>
              Copiar código
            </button>
          </p>
        </section>
      )}

      <section className="cartao">
        <h2>Recuperar</h2>
        <div className="campo">
          <label htmlFor="codigo-colado">Cole aqui o código</label>
          <textarea
            id="codigo-colado"
            rows={4}
            value={colado}
            onChange={(e) => setColado(e.target.value)}
            style={{ width: '100%', font: 'inherit' }}
          />
        </div>
        <button className="botao" onClick={recuperar} disabled={colado.trim() === ''}>
          Recuperar progresso
        </button>
      </section>

      {aviso && (
        <div className={`mensagem mensagem--${aviso.tipo}`} role="status">
          {aviso.texto}
        </div>
      )}

      <button className="botao botao--secundario" onClick={aoVoltar}>
        Voltar
      </button>
    </main>
  )
}
