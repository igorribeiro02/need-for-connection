import { useEffect, useRef, useState } from 'react'
import { JogoProvider, useJogo } from './JogoContext'
import { TelaEntrada } from '../features/auth/TelaEntrada'
import { TelaBackup } from '../features/backup/TelaBackup'
import { TelaMapa } from './TelaMapa'
import { TelaFase, type VoltarInterno } from './TelaFase'
import type { Posicao } from '../core/world/grid'

type Tela = { nome: 'mapa' } | { nome: 'fase'; id: string; revisao: boolean } | { nome: 'backup' }

function Rotas() {
  const { dados } = useJogo()
  const [tela, setTela] = useState<Tela>({ nome: 'mapa' })
  // onde o personagem está no mapa: continua no mesmo lugar ao voltar de uma fase
  const [posicaoMapa, setPosicaoMapa] = useState<Posicao | null>(null)

  // Botão voltar do celular/navegador: fora do mapa, ele volta um passo (ou ao mapa) em vez de sair do jogo.
  // Guardamos UMA entrada extra no histórico enquanto a pessoa não está no mapa.
  const voltarInterno = useRef<VoltarInterno | null>(null)
  const armado = useRef(false)
  const ignorarProximo = useRef(false)

  const armar = () => {
    if (armado.current) return
    window.history.pushState({ nfc: 'voltar' }, '')
    armado.current = true
  }
  const desarmar = () => {
    if (!armado.current) return
    armado.current = false
    ignorarProximo.current = true
    window.history.back()
  }
  const irParaMapa = () => {
    desarmar()
    setTela({ nome: 'mapa' })
  }
  const abrir = (t: Tela) => {
    armar()
    setTela(t)
  }

  useEffect(() => {
    const aoVoltarNoNavegador = () => {
      if (ignorarProximo.current) {
        ignorarProximo.current = false
        return
      }
      if (!armado.current) return
      armado.current = false // a entrada extra foi usada
      if (voltarInterno.current?.()) armar() // voltou um passo: continua dentro da fase
      else setTela({ nome: 'mapa' })
    }
    window.addEventListener('popstate', aoVoltarNoNavegador)
    return () => window.removeEventListener('popstate', aoVoltarNoNavegador)
  }, [])

  if (tela.nome === 'backup') return <TelaBackup aoVoltar={irParaMapa} />
  if (!dados) return <TelaEntrada aoImportar={() => abrir({ nome: 'backup' })} />
  if (tela.nome === 'fase') {
    return (
      <TelaFase
        key={`${tela.id}-${tela.revisao}`}
        faseId={tela.id}
        revisao={tela.revisao}
        aoVoltar={irParaMapa}
        registrarVoltar={(fn) => {
          voltarInterno.current = fn
        }}
      />
    )
  }
  return (
    <TelaMapa
      posicao={posicaoMapa}
      definirPosicao={setPosicaoMapa}
      aoAbrirFase={(id, revisao) => abrir({ nome: 'fase', id, revisao })}
      aoAbrirBackup={() => abrir({ nome: 'backup' })}
    />
  )
}

export default function App() {
  return (
    <JogoProvider>
      <Rotas />
    </JogoProvider>
  )
}
