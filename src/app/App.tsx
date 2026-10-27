import { useState } from 'react'
import { JogoProvider, useJogo } from './JogoContext'
import { TelaEntrada } from '../features/auth/TelaEntrada'
import { TelaBackup } from '../features/backup/TelaBackup'
import { TelaMapa } from './TelaMapa'
import { TelaFase } from './TelaFase'

type Tela = { nome: 'mapa' } | { nome: 'fase'; id: string; revisao: boolean } | { nome: 'backup' }

function Rotas() {
  const { dados } = useJogo()
  const [tela, setTela] = useState<Tela>({ nome: 'mapa' })

  if (tela.nome === 'backup') return <TelaBackup aoVoltar={() => setTela({ nome: 'mapa' })} />
  if (!dados) return <TelaEntrada aoImportar={() => setTela({ nome: 'backup' })} />
  if (tela.nome === 'fase') {
    return (
      <TelaFase
        key={`${tela.id}-${tela.revisao}`}
        faseId={tela.id}
        revisao={tela.revisao}
        aoVoltar={() => setTela({ nome: 'mapa' })}
      />
    )
  }
  return (
    <TelaMapa
      aoAbrirFase={(id, revisao) => setTela({ nome: 'fase', id, revisao })}
      aoAbrirBackup={() => setTela({ nome: 'backup' })}
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
