import { botoes, type Marca, type Tema } from '../../content/guias/celularReal'

// Desenho de um celular visto de frente, com os botões da lateral e o gesto de cada tarefa.
// viewBox 340x400: o celular fica no meio, os rótulos nas laterais.

const COR_DESTAQUE = '#ff7a00'
const COR_CORPO = '#2b3340'
const COR_TELA = '#f4f7fb'
const TEXTO = '#1a1a1a'

const X0 = 145 // esquerda do corpo
const W = 130
const Y0 = 20
const H = 350
const XD = X0 + W // direita do corpo

function Rotulo({ x, y, ancora, linhas, forte }: { x: number; y: number; ancora: 'start' | 'end'; linhas: string[]; forte?: boolean }) {
  return (
    <text x={x} y={y} textAnchor={ancora} fontSize="18" fontWeight={forte ? 700 : 600} fill={TEXTO}>
      {linhas.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 20}>
          {l}
        </tspan>
      ))}
    </text>
  )
}

function Botao({ lado, y, h, ativo }: { lado: 'esquerda' | 'direita'; y: number; h: number; ativo: boolean }) {
  const x = lado === 'direita' ? XD : X0 - 7
  return (
    <rect x={x} y={y} width={7} height={h} rx={3} fill={ativo ? COR_DESTAQUE : '#8a94a6'} stroke={ativo ? '#b45300' : 'none'} strokeWidth={ativo ? 1.5 : 0}>
      {ativo && <animate attributeName="opacity" values="1;0.45;1" dur="1.4s" repeatCount="indefinite" />}
    </rect>
  )
}

export function DesenhoCelular({ marca, tema }: { marca: Marca; tema: Tema }) {
  const b = botoes[marca]
  const iphone = marca === 'iphone'
  const volDir = b.ladoVolume === 'direita'
  const ladoVol = b.ladoVolume
  const xVol = volDir ? XD + 14 : X0 - 14
  const anc: 'start' | 'end' = volDir ? 'start' : 'end'
  // posições dos botões (de cima para baixo)
  const yMais = iphone ? 120 : 105
  const yMenos = iphone ? 168 : 105 + 24
  const hBot = iphone ? 36 : 48 // altura do botão (iPhone: dois botões; Android: gangorra)
  const yLiga = iphone ? 140 : 185

  const emVolume = tema === 'volume'
  const emPrint = tema === 'print'
  const maisAtivo = emVolume || (emPrint && b.printComVolume === 'mais')
  const menosAtivo = emVolume || (emPrint && b.printComVolume === 'menos')
  const ligaAtivo = emPrint

  return (
    <svg viewBox="0 0 420 400" role="img" aria-label={`Desenho de um celular ${marca}: ${tema}`} className="desenho-celular">
      {/* corpo e tela */}
      <rect x={X0} y={Y0} width={W} height={H} rx={24} fill={COR_CORPO} />
      <rect x={X0 + 7} y={Y0 + 7} width={W - 14} height={H - 14} rx={18} fill={emPrint ? '#fff' : COR_TELA} stroke={emPrint ? COR_DESTAQUE : 'none'} strokeWidth={emPrint ? 3 : 0}>
        {emPrint && <animate attributeName="opacity" values="1;0.6;1" dur="1.4s" repeatCount="indefinite" />}
      </rect>
      {iphone ? <rect x={X0 + W / 2 - 17} y={Y0 + 12} width={34} height={10} rx={5} fill={COR_CORPO} /> : <circle cx={X0 + W / 2} cy={Y0 + 18} r={4.5} fill={COR_CORPO} />}

      {/* botões da lateral */}
      {b.volumeSeparado ? (
        <>
          <Botao lado={ladoVol} y={yMais} h={hBot} ativo={maisAtivo} />
          <Botao lado={ladoVol} y={yMenos} h={hBot} ativo={menosAtivo} />
          {iphone && <Botao lado="esquerda" y={78} h={14} ativo={false} />}
        </>
      ) : (
        <>
          <Botao lado={ladoVol} y={yMais} h={hBot} ativo={maisAtivo || menosAtivo} />
          <line x1={volDir ? XD : X0 - 7} x2={volDir ? XD + 7 : X0} y1={yMais + hBot / 2} y2={yMais + hBot / 2} stroke="#fff" strokeWidth={1.5} />
        </>
      )}
      <Botao lado={b.ladoLiga} y={yLiga} h={iphone ? 56 : 34} ativo={ligaAtivo} />

      {/* ROTULOS de lateral */}
      {emVolume && (
        <>
          {b.volumeSeparado ? (
            <>
              <Rotulo x={xVol} y={yMais + 18} ancora={anc} linhas={['＋ AUMENTAR', 'botão de cima']} forte />
              <Rotulo x={xVol} y={yMenos + 18} ancora={anc} linhas={['－ DIMINUIR', 'botão de baixo']} forte />
            </>
          ) : (
            <>
              <Rotulo x={xVol} y={yMais + 10} ancora={anc} linhas={['＋ AUMENTAR']} forte />
              <Rotulo x={xVol} y={yMais + hBot - 2} ancora={anc} linhas={['－ DIMINUIR']} forte />
            </>
          )}
          <Rotulo x={b.ladoLiga === 'direita' ? XD + 14 : X0 - 14} y={yLiga + 22} ancora={b.ladoLiga === 'direita' ? 'start' : 'end'} linhas={['LIGAR']} />
          {/* barrinha de volume na tela */}
          <rect x={X0 + W - 34} y={Y0 + 60} width={14} height={90} rx={7} fill="#dfe6f0" />
          <rect x={X0 + W - 34} y={Y0 + 95} width={14} height={55} rx={7} fill={COR_DESTAQUE} />
          <text x={X0 + 60} y={Y0 + 200} textAnchor="middle" fontSize="38">🔊</text>
        </>
      )}

      {emPrint && (
        <>
          {b.printComVolume === 'mais' ? (
            <Rotulo x={xVol} y={yMais + 22} ancora={anc} linhas={['volume ＋', '(cima)']} forte />
          ) : (
            <Rotulo x={xVol} y={yMenos + (iphone ? 22 : 18)} ancora={anc} linhas={iphone ? ['volume －'] : ['volume －', '(baixo)']} forte />
          )}
          <Rotulo x={b.ladoLiga === 'direita' ? XD + 14 : X0 - 14} y={yLiga + 24} ancora={b.ladoLiga === 'direita' ? 'start' : 'end'} linhas={iphone ? ['LIGAR', '(lado direito)'] : ['LIGAR']} forte />
          <Rotulo x={XD + 14} y={yLiga + (iphone ? 70 : 62)} ancora="start" linhas={['APERTE OS', 'DOIS JUNTOS']} forte />
          <text x={X0 + 60} y={Y0 + 150} textAnchor="middle" fontSize="40">📸</text>
          <rect x={X0 + 14} y={Y0 + H - 78} width={34} height={52} rx={5} fill="#cfd8e6" stroke={COR_DESTAQUE} strokeWidth={2} />
          <text x={X0 + 31} y={Y0 + H - 46} textAnchor="middle" fontSize="16">🖼️</text>
        </>
      )}

      {tema === 'brilho' && <PainelBrilho painelDo={b.painelDo} vezes={b.vezesPainel} iphone={iphone} />}
    </svg>
  )
}

function PainelBrilho({ painelDo, vezes, iphone }: { painelDo: 'centro' | 'direita'; vezes: 1 | 2; iphone: boolean }) {
  const xDedo = painelDo === 'direita' ? X0 + W - 26 : X0 + W / 2
  const yTopo = Y0 + 34
  return (
    <g>
      {/* painel de atalhos */}
      <rect x={X0 + 14} y={yTopo + 56} width={W - 28} height={118} rx={12} fill="#dce6f5" />
      {iphone ? (
        <>
          <rect x={X0 + W - 52} y={yTopo + 66} width={30} height={98} rx={14} fill="#bcc8dc" />
          <rect x={X0 + W - 52} y={yTopo + 104} width={30} height={60} rx={14} fill={COR_DESTAQUE} />
          <text x={X0 + W - 37} y={yTopo + 155} textAnchor="middle" fontSize="16">☀️</text>
          <path d={`M ${X0 + W - 37} ${yTopo + 100} l 0 -26`} stroke="#b45300" strokeWidth={3} markerEnd="url(#seta)" />
          <text x={X0 + 38} y={yTopo + 112} textAnchor="middle" fontSize="12" fill={TEXTO} fontWeight={600}>
            barra do
          </text>
          <text x={X0 + 38} y={yTopo + 127} textAnchor="middle" fontSize="12" fill={TEXTO} fontWeight={600}>
            brilho →
          </text>
        </>
      ) : (
        <>
          <text x={X0 + 28} y={yTopo + 104} textAnchor="middle" fontSize="18">☀️</text>
          <rect x={X0 + 40} y={yTopo + 96} width={W - 62} height={8} rx={4} fill="#bcc8dc" />
          <rect x={X0 + 40} y={yTopo + 96} width={(W - 62) * 0.55} height={8} rx={4} fill={COR_DESTAQUE} />
          <circle cx={X0 + 40 + (W - 62) * 0.55} cy={yTopo + 100} r={9} fill="#fff" stroke={COR_DESTAQUE} strokeWidth={3} />
          <path d={`M ${X0 + 40 + (W - 62) * 0.55 + 14} ${yTopo + 100} l 22 0`} stroke="#b45300" strokeWidth={3} markerEnd="url(#seta)" />
        </>
      )}
      <defs>
        <marker id="seta" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
          <path d="M0,0 L12,6 L0,12 z" fill="#b45300" />
        </marker>
      </defs>
      {/* o dedo que desliza para baixo */}
      <path d={`M ${xDedo} ${Y0 + 28} L ${xDedo} ${Y0 + 86}`} stroke={COR_DESTAQUE} strokeWidth={5} strokeLinecap="round" markerEnd="url(#seta)" />
      <circle cx={xDedo} cy={Y0 + 28} r={9} fill={COR_DESTAQUE} opacity={0.85}>
        <animate attributeName="cy" values={`${Y0 + 28};${Y0 + 70};${Y0 + 28}`} dur="2s" repeatCount="indefinite" />
      </circle>
      <Rotulo x={painelDo === 'direita' ? X0 + W + 16 : X0 + W + 16} y={Y0 + 34} ancora="start" linhas={vezes === 2 ? ['1. Deslize', 'para baixo', '(2 vezes, se', 'for preciso)'] : ['1. Deslize', 'para baixo']} forte />
      <Rotulo x={X0 - 14} y={yTopo + 90} ancora="end" linhas={['2. Arraste a', 'bolinha do sol']} forte />
    </g>
  )
}
