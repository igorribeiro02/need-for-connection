import { Fragment, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { BancoConfig, BlocoApp, ItemApp, Passo } from '../../core/engine/stepTypes'
import { idDoItem } from '../../core/engine/telaApp'
import { ultimaDigitacao } from '../../core/engine/ultimaDigitacao'
import { CampoDigitar } from '../celular/CampoDigitar'
import { CelularBrilho } from './CelularBrilho'

type Props = {
  tema: BancoConfig['tema']
  passo: Passo
  nome: string
  destacar: boolean
  aoResponder: (resposta: string) => void
  /** A seta ← de dentro do app: volta ao passo anterior (no primeiro passo, sai da fase). */
  aoVoltarPasso: () => void
}

/**
 * Tela de app de banco desenhada por blocos (passo.tela.app). A estrutura vem de capturas reais do aplicativo;
 * cores, fontes e ícones são nossos. Em passos de tocar, cada botão responde com o seu id (o certo avança, os outros
 * mostram a dica gentil). Botões "inertes" e botões em passos de digitar só avisam que não fazem parte do exercício.
 */
export function TelaApp({ tema, passo, nome, destacar, aoResponder, aoVoltarPasso }: Props) {
  const tela = passo.tela!.app!
  const [aviso, setAviso] = useState('')
  // microfone de segurar: segundos gravados enquanto o dedo está na tela (null = dedo solto)
  const [gravado, setGravado] = useState<number | null>(null)
  const inicioToque = useRef(0)
  const relogio = useRef<number | undefined>(undefined)
  const soltou = useRef(false)
  const toque = passo.tipo === 'tocar'

  const primeiroNome = nome.trim().split(/\s+/)[0] || 'Você'
  const iniciais =
    nome
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('') || 'EU'
  const [hoje] = useState(() => new Date().toLocaleDateString('pt-BR'))
  const t = (texto: string | undefined) => texto?.replaceAll('{nome}', primeiroNome).replaceAll('{iniciais}', iniciais).replaceAll('{hoje}', hoje).replaceAll('{digitado}', ultimaDigitacao() || 'Eu vou, Ana!')

  function tocou(item: ItemApp) {
    if (item.inerte || !toque) {
      setAviso(
        passo.tipo === 'digitar'
          ? `Agora, escreva na caixa. "${item.rotulo}" fica para depois.`
          : passo.painelExercicio
            ? 'Primeiro responda à pergunta, logo abaixo da tela.'
            : `"${item.rotulo}" não é o que precisamos agora. Siga o guia no alto da tela.`,
      )
      return
    }
    setAviso('')
    aoResponder(idDoItem(item))
  }

  function comecarSegurar(item: ItemApp) {
    if (!toque || item.inerte) {
      tocou(item)
      return
    }
    soltou.current = false
    setAviso('')
    inicioToque.current = Date.now()
    setGravado(0)
    window.clearInterval(relogio.current)
    relogio.current = window.setInterval(() => setGravado(Math.floor((Date.now() - inicioToque.current) / 1000)), 200)
  }

  function soltarSegurar(item: ItemApp, cancelado = false) {
    if (gravado === null) return
    window.clearInterval(relogio.current)
    const duracao = Date.now() - inicioToque.current
    setGravado(null)
    soltou.current = true
    if (cancelado) return
    // no modo guiado ('Me mostre onde tocar') um toque curto basta, para quem não consegue segurar
    if (duracao >= 1200 || destacar) tocou(item)
    else setAviso('Segure o dedo no microfone enquanto fala, e só solte quando terminar.')
  }

  const marca = (item: ItemApp) => (destacar && toque && idDoItem(item) === passo.alvo ? ' destacado' : '')
  const selo = (item: ItemApp) => (item.etiqueta ? <small className="app__selo-item">{item.etiqueta}</small> : null)

  const botao = (item: ItemApp, classe: string, filhos: ReactNode, chave: string) => (
    <button key={chave} type="button" aria-label={item.anel ? item.rotulo : undefined} className={`${classe}${item.principal ? ' app__cheio' : ''}${item.anel ? ' app__anel' : ''}${marca(item)}`} onClick={() => tocou(item)}>
      {filhos}
    </button>
  )

  const icone = (item: ItemApp) =>
    item.icone ? (
      <span className="app__icone" aria-hidden="true">
        {item.icone}
      </span>
    ) : null

  function bloco(b: BlocoApp, i: number): ReactNode {
    switch (b.tipo) {
      case 'barra': {
        const titulo = b.titulo && (
          <h2 className={b.grande ? 'app__titulo-grande' : 'app__titulo-barra'}>{t(b.titulo)}</h2>
        )
        return (
          <div key={i} className="app__barra">
            <div className="app__barra-linha">
              {b.voltar && (
                <button
                  key="voltar"
                  type="button"
                  className={`app__redondo${typeof b.voltar === 'object' ? marca(b.voltar) : ''}`}
                  aria-label={typeof b.voltar === 'object' ? b.voltar.rotulo : 'Voltar'}
                  onClick={() => {
                    // a seta é a resposta certa só quando o passo pede esse botão (ex.: cancelar); nos outros casos, volta um passo
                    if (typeof b.voltar === 'object' && toque && idDoItem(b.voltar) === passo.alvo) tocou(b.voltar)
                    else aoVoltarPasso()
                  }}
                >
                  <span aria-hidden="true">{typeof b.voltar === 'object' && b.voltar.icone ? b.voltar.icone : '←'}</span>
                </button>
              )}
              {b.grande !== 'abaixo' && titulo}
              <span className="app__espaco" />
              {b.acoes?.map((a, k) =>
                botao(a, 'app__redondo', <><span aria-hidden="true">{a.icone ?? '•'}</span><span className="sr-only">{a.rotulo}</span></>, `a${k}`),
              )}
            </div>
            {b.sobretitulo && <p className="app__sobretitulo">{t(b.sobretitulo)}</p>}
            {b.grande === 'abaixo' && titulo}
          </div>
        )
      }
      case 'busca':
        return (
          <div key={i} className="app__busca app__busca--sozinha" aria-hidden="true">
            🔍 {b.texto}
          </div>
        )
      case 'pesquisa':
        return (
          <div key={i} className="app__bloco">
            {botao(b.item, 'app__pesquisa', <><span aria-hidden="true">{b.item.icone ?? '🔍'}</span><strong>{b.item.rotulo}</strong></>, 'pq')}
          </div>
        )
      case 'faixa':
        return (
          <div key={i} className="app__faixa">
            <div className="app__barra-linha">
              {b.avatar && (
                <span className="app__avatar" aria-hidden="true">
                  {t(b.avatar)}
                </span>
              )}
              {b.saudacao && <strong className="app__saudacao">{t(b.saudacao)}</strong>}
              {b.busca && (
                <span className="app__busca" aria-hidden="true">
                  🔍 {b.busca}
                </span>
              )}
              {!b.busca && <span className="app__espaco" />}
              {b.acoes?.map((a, k) =>
                botao(a, 'app__redondo', <><span aria-hidden="true">{a.icone ?? '•'}</span><span className="sr-only">{a.rotulo}</span></>, `a${k}`),
              )}
            </div>
            {b.contas && (
              <div className="app__contas">
                {b.contas.map((c, k) => botao(c, `app__conta${k === 0 ? ' app__conta--ativa' : ''}`, <>{icone(c)}{c.rotulo}</>, `c${k}`))}
              </div>
            )}
          </div>
        )
      case 'abas':
        return (
          <div key={i} className="app__abas" role="presentation">
            {b.itens.map((a, k) => (
              <span key={a} className={k === b.ativa ? 'app__aba app__aba--ativa' : 'app__aba'}>
                {a}
              </span>
            ))}
          </div>
        )
      case 'saldo':
        return (
          <div key={i} className={`app__saldo${b.linha ? ' app__saldo--linha' : ''}`}>
            {(b.rotulo || b.extrato) && (
              <div className="app__saldo-topo">
                <span>{b.rotulo}</span>
                {b.extrato && <span className="app__link">{b.extrato} ›</span>}
              </div>
            )}
            <div className="app__saldo-valor">
              <strong>{b.valor}</strong>
              {b.olho && botao(b.olho, 'app__olho', <><span aria-hidden="true">{b.olho.icone ?? '👁'}</span><span className="sr-only">{b.olho.rotulo}</span></>, 'olho')}
            </div>
            {b.apoio && <p className="app__apoio">{b.apoio}</p>}
            {b.botao && botao(b.botao, 'app__botao-largo', b.botao.rotulo, 'bs')}
          </div>
        )
      case 'fichas':
        return (
          <div key={i} className="app__fichas">
            {b.itens.map((f, k) => botao(f, `app__ficha${k === b.ativa ? ' app__ficha--ativa' : ''}`, <>{icone(f)}{f.rotulo}</>, `f${k}`))}
          </div>
        )
      case 'atalhos':
        return (
          <div key={i} className="app__bloco">
            {b.titulo && <h3 className="app__secao">{b.titulo}</h3>}
            <div className={`app__atalhos app__atalhos--${b.estilo}`}>
              {b.itens.map((a, k) =>
                botao(
                  a,
                  'app__atalho',
                  b.estilo === 'quadrados' ? (
                    <>{icone(a)}{selo(a)}<span>{a.rotulo}</span>{a.detalhe && <small>{a.detalhe}</small>}</>
                  ) : (
                    <>{selo(a)}{icone(a)}<span>{a.rotulo}</span>{a.detalhe && <small>{a.detalhe}</small>}</>
                  ),
                  `t${k}`,
                ),
              )}
            </div>
          </div>
        )
      case 'lista':
        return (
          <div key={i} className="app__bloco">
            {(b.titulo || b.acao) && (
              <div className="app__titulo-linha">
                {b.titulo && <h3 className="app__secao">{b.titulo}</h3>}
                {b.acao && botao(b.acao, 'app__link-botao', b.acao.rotulo, 'la')}
              </div>
            )}
            <ul className={`app__lista${b.estilo === 'caixas' ? ' app__lista--caixas' : ''}`}>
              {b.itens.map((l, k) => (
                <li key={k}>
                  {botao(l, 'app__linha', <><span>{icone(l)}<span><strong>{l.rotulo}</strong>{l.detalhe && <small>{l.detalhe}</small>}</span></span><span className="app__seta" aria-hidden="true">›</span></>, `l${k}`)}
                </li>
              ))}
            </ul>
          </div>
        )
      case 'promo':
        return (
          <div key={i} className={`app__promo${b.escura ? ' app__promo--escura' : ''}`}>
            <strong>{b.titulo}</strong>
            {b.texto && <p>{b.texto}</p>}
            {b.botao && botao(b.botao, 'app__botao-largo', b.botao.rotulo, 'bp')}
          </div>
        )
      case 'titulo':
        return (
          <div key={i} className="app__titulo-linha app__bloco">
            <h3 className="app__secao">{t(b.texto)}</h3>
            {b.acao &&
              botao(
                b.acao,
                'app__link-botao',
                b.acao.icone ? <><span aria-hidden="true">{b.acao.icone}</span><span className="sr-only">{b.acao.rotulo}</span></> : b.acao.rotulo,
                'ta',
              )}
            {b.apoio && <p className="app__apoio app__apoio--cheio">{t(b.apoio)}</p>}
          </div>
        )
      case 'campo':
        return (
          <div key={i} className={`app__campo${b.valor === 'esquerda' ? ' app__campo--valor-esq' : b.valor ? ' app__campo--valor' : ''}${b.icone ? ' app__campo--icone' : ''}`}>
            {passo.tipo === 'digitar' ? (
              <CampoDigitar key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder}>
                {b.entre?.map((linha) => (
                  <p key={linha} className="app__entre">
                    {t(linha)}
                  </p>
                ))}
              </CampoDigitar>
            ) : (
              <p className="app__campo-vazio">{passo.rotuloCampo ?? (b.valor ? 'R$ 0,00' : '')}</p>
            )}
            {b.icone && (
              <span className="app__campo-icone" aria-hidden="true">
                {b.icone}
              </span>
            )}
          </div>
        )
      case 'dados':
        return (
          <div key={i} className="app__bloco">
            {b.titulo && <h3 className="app__secao">{b.titulo}</h3>}
            <dl className="app__dados">
              {b.linhas.map((l) => (
                <div key={l.rotulo}>
                  <dt>{l.rotulo}</dt>
                  <dd>{t(l.valor)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )
      case 'destaque':
        return (
          <div key={i} className="app__destaque">
            <span className="app__avatar app__avatar--grande" aria-hidden="true">
              •••
            </span>
            <strong className="app__valor-grande">{b.valor}</strong>
            {b.nome && <span className="app__nome-destino">{b.nome}</span>}
            {b.chip && botao(b.chip, 'app__chip', <>{b.chip.rotulo} <span aria-hidden="true">✎</span></>, 'ch')}
          </div>
        )
      case 'cartao':
        return (
          <div key={i} className="app__cartao">
            <strong>{t(b.titulo)}</strong>
            {b.texto && <span>{t(b.texto)}</span>}
            {b.link && <span className="app__link">{b.link}</span>}
          </div>
        )
      case 'botao':
        return (
          <div key={i} className="app__rodape">
            {botao({ principal: true, ...b.item }, 'app__botao-largo', b.item.rotulo, 'bb')}
          </div>
        )
      case 'janela': {
        const lado = b.lado ?? 'direita'
        return (
          <div key={i} className={`app__janela${b.perigo ? ' app__janela--perigo' : ''}`} role="dialog" aria-label="Janela que apareceu sozinha">
            {b.fechar && (
              <button
                type="button"
                className={`app__janela-x app__janela-x--${lado}${marca(b.fechar)}`}
                aria-label={b.fechar.rotulo}
                onClick={() => tocou(b.fechar!)}
              >
                <span aria-hidden="true">{b.fechar.icone ?? '✕'}</span>
              </button>
            )}
            <strong className="app__janela-titulo">{t(b.titulo)}</strong>
            {b.texto && <p>{t(b.texto)}</p>}
            {b.botoes.map((x, k) =>
              x.principal === false
                ? botao(x, 'app__link-pequeno', x.rotulo, `jb${k}`)
                : botao({ principal: true, ...x }, 'app__botao-largo', x.rotulo, `jb${k}`),
            )}
          </div>
        )
      }
      case 'folha':
        return (
          <div key={i} className="app__folha">
            <p>{b.texto}</p>
            {botao({ principal: true, ...b.botao }, 'app__botao-largo', b.botao.rotulo, 'bf')}
          </div>
        )
      case 'navegacao':
        return (
          <nav key={i} className={`app__nav${b.ativoCheio ? ' app__nav--cheio' : ''}`} aria-label="Menu do aplicativo">
            {b.itens.map((n, k) =>
              botao(
                n,
                `app__nav-item${k === b.ativo ? ' app__nav-item--ativo' : ''}${k === b.central ? ' app__nav-item--central' : ''}`,
                <>{icone(n)}<span>{n.rotulo}</span></>,
                `n${k}`,
              ),
            )}
          </nav>
        )
      case 'zapTopo':
        return (
          <div key={i} className="zap-topo">
            {b.voltar && (
              <button
                type="button"
                className={`zap-topo__voltar${marca(b.voltar)}`}
                aria-label={b.voltar.rotulo}
                onClick={() => {
                  if (toque && idDoItem(b.voltar!) === passo.alvo) tocou(b.voltar!)
                  else aoVoltarPasso()
                }}
              >
                <span aria-hidden="true">{b.voltar.icone ?? '←'}</span>
              </button>
            )}
            {b.avatar && (
              <span className="zap-avatar" aria-hidden="true">
                {b.avatar}
              </span>
            )}
            <div className="zap-topo__texto">
              {b.titulo && <strong>{t(b.titulo)}</strong>}
              {b.subtitulo && <small>{b.subtitulo}</small>}
            </div>
            <div className="zap-topo__acoes">
              {b.acoes?.map((a, k) =>
                botao(a, 'zap-icone zap-icone--topo', <><span aria-hidden="true">{a.icone ?? '•'}</span><span className="sr-only">{a.rotulo}</span></>, `za${k}`),
              )}
            </div>
          </div>
        )
      case 'zapConversas':
        return (
          <div key={i} className="zap-conversas">
            {b.filtros && (
              <div className="zap-filtros" aria-hidden="true">
                {b.filtros.map((f, k) => (
                  <span key={f} className={k === 0 ? 'ativo' : ''}>
                    {f}
                  </span>
                ))}
              </div>
            )}
            <ul>
              {b.itens.map((c) => (
                <li key={c.id}>
                  {botao(
                    { rotulo: c.nome, id: c.id },
                    'zap-conversa',
                    <>
                      <span className="zap-avatar" aria-hidden="true">
                        {c.avatar}
                      </span>
                      <span className="zap-conversa__meio">
                        <strong>{c.nome}</strong>
                        <small>
                          {c.ticks && <span className={`zap-ticks zap-ticks--${c.ticks}`}>✓✓ </span>}
                          {c.previa}
                        </small>
                      </span>
                      <span className="zap-conversa__lado">
                        <small className={c.naoLidas ? 'novo' : ''}>{c.hora}</small>
                        {c.naoLidas ? (
                          <b className="zap-badge" aria-label={`${c.naoLidas} mensagens novas`}>
                            {c.naoLidas}
                          </b>
                        ) : null}
                      </span>
                    </>,
                    c.id,
                  )}
                </li>
              ))}
            </ul>
            {b.novo && botao(b.novo, 'zap-fab', <><span aria-hidden="true">{b.novo.icone ?? '💬'}</span><span className="sr-only">{b.novo.rotulo}</span></>, 'fab')}
          </div>
        )
      case 'zapChat': {
        const gravando = gravado !== null && !!b.microfone
        return (
          <div key={i} className="zap-chat">
            {b.aviso && (
              <div className="zap-aviso">
                <p>{b.aviso.texto}</p>
                {b.aviso.acoes && (
                  <div className="zap-aviso__acoes">
                    {b.aviso.acoes.map((a, k) => botao(a, 'zap-aviso__botao', a.rotulo, `zav${k}`))}
                  </div>
                )}
              </div>
            )}
            <div className="zap-chat__mensagens" role="log" aria-label="Mensagens da conversa">
              {b.mensagens.map((m, k) => (
                <Fragment key={k}>
                  {m.dia && <p className="zap-dia">{m.dia}</p>}
                  <div className={`zap-balao zap-balao--${m.de}`}>
                    {m.autor && <strong className="zap-autor">{m.autor}</strong>}
                    {m.foto && (
                      <span className="zap-foto" role="img" aria-label="Foto enviada">
                        {m.foto}
                      </span>
                    )}
                    {m.documento && (
                      <span className="zap-doc" role="img" aria-label={`Documento ${m.documento.nome}`}>
                        <span className="zap-doc__icone" aria-hidden="true">
                          📄
                        </span>
                        <span className="zap-doc__texto">
                          <strong>{m.documento.nome}</strong>
                          <small>{m.documento.info}</small>
                        </span>
                      </span>
                    )}
                    {m.audio && (
                      <span className="zap-audio" role="img" aria-label={`Áudio de ${m.audio}`}>
                        <span className="zap-audio__play">▶</span>
                        <span className="zap-onda">
                          {Array.from({ length: 18 }, (_, j) => (
                            <i key={j} style={{ height: `${30 + ((j * 37) % 60)}%` }} />
                          ))}
                        </span>
                        <small>{m.audio}</small>
                      </span>
                    )}
                    {m.texto && <span className="zap-texto">{t(m.texto)}</span>}
                    <small className="zap-hora">
                      {m.hora}
                      {m.de === 'eu' && <span className={`zap-ticks zap-ticks--${m.estado ?? 'lida'}`}> {m.estado === 'enviada' ? '✓' : '✓✓'}</span>}
                    </small>
                  </div>
                </Fragment>
              ))}
            </div>
            <div className={`zap-compositor${gravando ? ' zap-compositor--gravando' : ''}`}>
              {b.escrevendo && passo.tipo === 'digitar' ? (
                <div className="zap-escrevendo">
                  <CampoDigitar key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder} />
                </div>
              ) : (
                <>
                  {gravando ? (
                    <div className="zap-gravando" role="status">
                      <span className="zap-ponto" aria-hidden="true" />
                      <strong>0:0{Math.min(gravado ?? 0, 9)}</strong>
                      <span>Fale agora…</span>
                    </div>
                  ) : (
                    <div className="zap-pilula">
                      <span aria-hidden="true">😊</span>
                      {b.campo ? botao(b.campo, 'zap-campo', b.texto ?? b.campo.rotulo, 'zc') : <span className="zap-campo zap-campo--vazio">{b.texto ?? 'Mensagem'}</span>}
                      {b.anexar && botao(b.anexar, 'zap-icone', <><span aria-hidden="true">📎</span><span className="sr-only">{b.anexar.rotulo}</span></>, 'zan')}
                      {b.camera && botao(b.camera, 'zap-icone', <><span aria-hidden="true">📷</span><span className="sr-only">{b.camera.rotulo}</span></>, 'zca')}
                    </div>
                  )}
                  {b.enviar ? (
                    botao(b.enviar, 'zap-redondo', <><span aria-hidden="true">➤</span><span className="sr-only">{b.enviar.rotulo}</span></>, 'zen')
                  ) : b.microfone ? (
                    <button
                      type="button"
                      className={`zap-redondo zap-redondo--mic${gravando ? ' zap-redondo--gravando' : ''}${marca(b.microfone)}`}
                      aria-label={`${b.microfone.rotulo} (segure o dedo)`}
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture?.(e.pointerId)
                        comecarSegurar(b.microfone!)
                      }}
                      onPointerUp={() => soltarSegurar(b.microfone!)}
                      onPointerCancel={() => soltarSegurar(b.microfone!, true)}
                      onContextMenu={(e) => e.preventDefault()}
                      onKeyDown={(e) => {
                        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                          e.preventDefault()
                          comecarSegurar(b.microfone!)
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') soltarSegurar(b.microfone!)
                      }}
                      onClick={() => {
                        // o clique que vem logo depois de soltar já foi tratado
                        if (soltou.current) soltou.current = false
                        else if (destacar && toque) tocou(b.microfone!)
                      }}
                    >
                      <span aria-hidden="true">🎤</span>
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        )
      }
      case 'zapMenu':
        return (
          <ul key={i} className="zap-menu" role="menu">
            {b.itens.map((x, k) => (
              <li key={k} role="none">
                {botao(x, 'zap-menu__item', x.rotulo, `zm${k}`)}
              </li>
            ))}
          </ul>
        )
      case 'zapDocumentos':
        return (
          <div key={i} className="zap-documentos">
            {b.titulo && <h3>{b.titulo}</h3>}
            <ul>
              {b.itens.map((x, k) => (
                <li key={k}>
                  {botao(
                    x,
                    'zap-documento',
                    <>
                      <span className="zap-doc__icone" aria-hidden="true">
                        📄
                      </span>
                      <span className="zap-doc__texto">
                        <strong>{x.rotulo}</strong>
                        {x.detalhe && <small>{x.detalhe}</small>}
                      </span>
                    </>,
                    `zd${k}`,
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      case 'zapDialogo':
        return (
          <div key={i} className="zap-dialogo" role="dialog" aria-label={b.titulo}>
            <h3>{t(b.titulo)}</h3>
            {b.documento && (
              <p className="zap-dialogo__doc">
                <span aria-hidden="true">📄</span> {b.documento}
              </p>
            )}
            {b.texto && <p>{t(b.texto)}</p>}
            {b.marcado && (
              <p className="zap-dialogo__marcado">
                <span aria-hidden="true">☑</span> {b.marcado}
              </p>
            )}
            <div className="zap-dialogo__botoes">{b.botoes.map((x, k) => botao(x, 'zap-dialogo__botao', x.rotulo, `zb${k}`))}</div>
          </div>
        )
      case 'zapAnexos':
        return (
          <div key={i} className="zap-anexos" role="group" aria-label="Anexar">
            {b.itens.map((x, k) =>
              botao(
                x,
                'zap-anexo',
                <>
                  <span className={`zap-anexo__circulo zap-anexo__circulo--${k % 6}`} aria-hidden="true">
                    {x.icone}
                  </span>
                  <span>{x.rotulo}</span>
                </>,
                `zx${k}`,
              ),
            )}
          </div>
        )
      case 'endereco':
        return (
          <p key={i} className="cel-endereco" aria-label={`Endereço do site: ${b.texto}`}>
            <span aria-hidden="true">{b.seguro === false ? '⚠️' : '🔒'}</span> {b.texto}
          </p>
        )
      case 'celularBrilho':
        return (
          <CelularBrilho
            key={i}
            etapa={b.etapa}
            valor={b.valor}
            minimo={b.minimo}
            maximo={b.maximo}
            item={b.item}
            ativo={toque}
            destacado={marca(b.item) !== ''}
            aoAcertar={() => tocou(b.item)}
            aoAvisar={setAviso}
          />
        )
      case 'espaco':
        return <div key={i} className="app__espaco-bloco" aria-hidden="true" />
      case 'texto':
        return (
          <p key={i} className={`app__texto${b.centro ? ' app__texto--centro' : ''}${b.link ? ' app__link' : ''}`}>
            {t(b.texto)}
          </p>
        )
    }
  }

  const estilo = {
    '--banco-cor': tema.corPrincipal,
    '--app-faixa-fundo': tema.faixa?.fundo ?? tema.corPrincipal,
    '--app-faixa-texto': tema.faixa?.texto ?? '#ffffff',
    '--app-link': tema.link ?? tema.corPrincipal,
  } as CSSProperties

  return (
    <div className={`app${tela.escuro ? ' app--escuro' : ''}${tela.escurecida ? ' app--escurecida' : ''}${tela.zap ? ' app--zap' : ''}`} style={estilo}>
      {tela.blocos.map(bloco)}

      {passo.painelExercicio && passo.elementos && (
        <div className="app__painel" role="group" aria-label="Pergunta">
          <p>Responda aqui:</p>
          {passo.elementos.map((el) => (
            <button
              key={el.id}
              type="button"
              className={`botao${destacar && el.id === passo.alvo ? ' destacado' : ''}`}
              onClick={() => aoResponder(el.id)}
            >
              {el.rotulo}
            </button>
          ))}
        </div>
      )}

      <p className="app__aviso" role="status" aria-live="polite">
        {aviso}
      </p>
    </div>
  )
}
