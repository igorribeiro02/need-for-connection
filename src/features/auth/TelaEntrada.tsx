import { useState, type FormEvent } from 'react'
import { useJogo } from '../../app/JogoContext'
import { conferePin, hashPin, pinValido } from '../../core/progress/pin'
import { armazenamentoDisponivel } from '../../core/progress/storage'
import type { Perfil } from '../../core/progress/schema'

const AVATARES = ['🙂', '👵', '👴', '🧓', '🌻', '🐦', '☕', '📖']

export function TelaEntrada({ aoImportar }: { aoImportar: () => void }) {
  const { perfis, entrar, criar } = useJogo()
  const [criando, setCriando] = useState(perfis.length === 0)
  const [pedindoPin, setPedindoPin] = useState<Perfil | null>(null)
  const [pinDigitado, setPinDigitado] = useState('')
  const [erroPin, setErroPin] = useState('')

  const [nome, setNome] = useState('')
  const [avatar, setAvatar] = useState(AVATARES[0])
  const [pin, setPin] = useState('')
  const [erro, setErro] = useState('')

  async function escolher(p: Perfil) {
    if (p.pinHash) {
      setPedindoPin(p)
      setPinDigitado('')
      setErroPin('')
    } else {
      entrar(p.id)
    }
  }

  async function confirmarPin(e: FormEvent) {
    e.preventDefault()
    if (pedindoPin?.pinHash && (await conferePin(pinDigitado, pedindoPin.pinHash))) {
      entrar(pedindoPin.id)
    } else {
      setErroPin('Esse número não confere. Tente de novo.')
    }
  }

  async function cadastrar(e: FormEvent) {
    e.preventDefault()
    if (nome.trim().length < 2) {
      setErro('Escreva o seu nome (pelo menos 2 letras).')
      return
    }
    if (pin !== '' && !pinValido(pin)) {
      setErro('O número secreto precisa ter 4 dígitos. Ou deixe em branco.')
      return
    }
    setErro('')
    criar({ nome: nome.trim(), avatar, pinHash: pin ? await hashPin(pin) : undefined })
  }

  return (
    <main className="pagina">
      <h1>Need for Connection</h1>
      <p>Aprenda a usar o celular no seu ritmo, sem pressa e sem medo de errar.</p>

      {!armazenamentoDisponivel() && (
        <div className="mensagem mensagem--erro" role="alert">
          Este navegador não está guardando dados (talvez esteja em janela anônima). Você pode jogar, mas o progresso
          não será salvo.
        </div>
      )}

      {pedindoPin ? (
        <form className="cartao" onSubmit={confirmarPin}>
          <h2>
            {pedindoPin.avatar} {pedindoPin.nome}
          </h2>
          <div className="campo">
            <label htmlFor="pin-entrada">Número secreto (4 dígitos)</label>
            <input
              id="pin-entrada"
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              value={pinDigitado}
              onChange={(e) => setPinDigitado(e.target.value)}
            />
          </div>
          {erroPin && (
            <div className="mensagem mensagem--erro" role="alert">
              {erroPin}
            </div>
          )}
          <div className="linha">
            <button className="botao" type="submit">
              Entrar
            </button>
            <button className="botao botao--secundario" type="button" onClick={() => setPedindoPin(null)}>
              Voltar
            </button>
          </div>
        </form>
      ) : criando ? (
        <form className="cartao" onSubmit={cadastrar}>
          <h2>Criar meu perfil</h2>
          <div className="campo">
            <label htmlFor="nome">Como você quer ser chamado?</label>
            <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" />
          </div>
          <fieldset className="campo" style={{ border: 'none', padding: 0 }}>
            <legend style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Escolha uma figura</legend>
            <div className="linha">
              {AVATARES.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={a === avatar ? 'botao' : 'botao botao--secundario'}
                  aria-pressed={a === avatar}
                  aria-label={`Figura ${a}`}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="campo">
            <label htmlFor="pin-novo">Número secreto (opcional)</label>
            <input
              id="pin-novo"
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <p className="ajuda-campo">
              4 dígitos. Serve só para separar perfis neste aparelho. Nunca use a senha do seu banco aqui.
            </p>
          </div>
          {erro && (
            <div className="mensagem mensagem--erro" role="alert">
              {erro}
            </div>
          )}
          <div className="linha">
            <button className="botao" type="submit">
              Começar
            </button>
            {perfis.length > 0 && (
              <button className="botao botao--secundario" type="button" onClick={() => setCriando(false)}>
                Voltar
              </button>
            )}
          </div>
        </form>
      ) : (
        <section className="cartao" aria-label="Perfis neste aparelho">
          <h2>Quem vai jogar?</h2>
          <div className="linha">
            {perfis.map((p) => (
              <button key={p.id} className="botao" onClick={() => escolher(p)}>
                {p.avatar} {p.nome}
              </button>
            ))}
          </div>
          <div className="linha" style={{ marginTop: 'var(--espaco)' }}>
            <button className="botao botao--secundario" onClick={() => setCriando(true)}>
              Criar novo perfil
            </button>
          </div>
        </section>
      )}

      <p>
        <button className="botao botao--secundario" onClick={aoImportar}>
          Recuperar meu progresso com um código
        </button>
      </p>
    </main>
  )
}
