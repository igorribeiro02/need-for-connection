import { useState, type CSSProperties, type ReactNode } from 'react'
import type { BancoConfig, BlocoApp, ItemApp, Passo } from '../../core/engine/stepTypes'
import { idDoItem } from '../../core/engine/telaApp'
import { CampoDigitar } from '../celular/CampoDigitar'

type Props = {
  banco: BancoConfig
  passo: Passo
  nome: string
  destacar: boolean
  aoResponder: (resposta: string) => void
}

/**
 * Tela de app de banco desenhada por blocos (passo.tela.app). A estrutura vem de capturas reais do aplicativo;
 * cores, fontes e ícones são nossos. Em passos de tocar, cada botão responde com o seu id (o certo avança, os outros
 * mostram a dica gentil). Botões "inertes" e botões em passos de digitar só avisam que não fazem parte do exercício.
 */
export function TelaApp({ banco, passo, nome, destacar, aoResponder }: Props) {
  const tela = passo.tela!.app!
  const [aviso, setAviso] = useState('')
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
  const t = (texto: string | undefined) => texto?.replaceAll('{nome}', primeiroNome).replaceAll('{iniciais}', iniciais).replaceAll('{hoje}', hoje)

  function tocou(item: ItemApp) {
    if (item.inerte || !toque) {
      setAviso(
        passo.tipo === 'digitar'
          ? `"${item.rotulo}" não funciona neste exercício. Use a caixa onde se escreve.`
          : passo.painelExercicio
            ? 'Primeiro responda à pergunta do exercício, logo abaixo da tela.'
            : `"${item.rotulo}" não funciona neste exercício.`,
      )
      return
    }
    setAviso('')
    aoResponder(idDoItem(item))
  }

  const marca = (item: ItemApp) => (destacar && toque && idDoItem(item) === passo.alvo ? ' destacado' : '')
  const selo = (item: ItemApp) => (item.etiqueta ? <small className="app__selo-item">{item.etiqueta}</small> : null)

  const botao = (item: ItemApp, classe: string, filhos: ReactNode, chave: string) => (
    <button key={chave} type="button" className={`${classe}${item.principal ? ' app__cheio' : ''}${marca(item)}`} onClick={() => tocou(item)}>
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
              {b.voltar &&
                botao(
                  typeof b.voltar === 'object' ? b.voltar : { rotulo: 'Voltar', inerte: true },
                  'app__redondo',
                  <span aria-hidden="true">{typeof b.voltar === 'object' && b.voltar.icone ? b.voltar.icone : '←'}</span>,
                  'voltar',
                )}
              {b.grande !== 'abaixo' && titulo}
              <span className="app__espaco" />
              {b.acoes?.map((a, k) =>
                botao(a, 'app__redondo', <><span aria-hidden="true">{a.icone ?? '•'}</span><span className="sr-only">{a.rotulo}</span></>, `a${k}`),
              )}
            </div>
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
            {b.acao && botao(b.acao, 'app__link-botao', b.acao.rotulo, 'ta')}
            {b.apoio && <p className="app__apoio app__apoio--cheio">{b.apoio}</p>}
          </div>
        )
      case 'campo':
        return (
          <div key={i} className={`app__campo${b.valor ? ' app__campo--valor' : ''}${b.icone ? ' app__campo--icone' : ''}`}>
            {passo.tipo === 'digitar' ? (
              <CampoDigitar key={passo.id} passo={passo} destacar={destacar} aoResponder={aoResponder}>
                {b.entre?.map((linha) => (
                  <p key={linha} className="app__entre">
                    {t(linha)}
                  </p>
                ))}
              </CampoDigitar>
            ) : (
              <p className="app__campo-vazio">{passo.rotuloCampo}</p>
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
      case 'folha':
        return (
          <div key={i} className="app__folha">
            <p>{b.texto}</p>
            {botao({ principal: true, ...b.botao }, 'app__botao-largo', b.botao.rotulo, 'bf')}
          </div>
        )
      case 'navegacao':
        return (
          <nav key={i} className="app__nav" aria-label="Menu do aplicativo (simulação)">
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
      case 'texto':
        return (
          <p key={i} className={`app__texto${b.centro ? ' app__texto--centro' : ''}${b.link ? ' app__link' : ''}`}>
            {t(b.texto)}
          </p>
        )
    }
  }

  const estilo = {
    '--banco-cor': banco.tema.corPrincipal,
    '--app-faixa-fundo': banco.tema.faixa?.fundo ?? banco.tema.corPrincipal,
    '--app-faixa-texto': banco.tema.faixa?.texto ?? '#ffffff',
    '--app-link': banco.tema.link ?? banco.tema.corPrincipal,
  } as CSSProperties

  return (
    <div className={`app${tela.escuro ? ' app--escuro' : ''}${tela.escurecida ? ' app--escurecida' : ''}`} style={estilo}>
      <p className="app__selo">Banco simulado</p>
      {tela.blocos.map(bloco)}

      {passo.painelExercicio && passo.elementos && (
        <div className="app__painel" role="group" aria-label="Pergunta do exercício">
          <p>Pergunta do exercício (não faz parte do app)</p>
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
