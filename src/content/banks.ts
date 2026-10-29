import type { BancoConfig } from '../core/engine/stepTypes'

// Bancos da lista, na ordem de clientes do Banco Central.
// ATENÇÃO: o desenho do caminho até o Pix (tradicional x digital) e os nomes dos botões são uma
// HIPÓTESE a validar abrindo os aplicativos de verdade. Não usamos logos nem cópias de telas:
// só o nome do banco aparece, como texto, na lista de escolha.
// Cores: todas com contraste mínimo de 4,5:1 contra texto branco (conferido em tests/content.test.ts).

const TRADICIONAL = ['home', 'menu', 'pagar', 'pix']
const DIGITAL = ['home', 'pix']

export const bancos: BancoConfig[] = [
  {
    id: 'caixa',
    nomeNaLista: 'Caixa',
    arquetipo: 'tradicional',
    caminhoAteOPix: TRADICIONAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Confirmar', menu: 'Menu', pagar: 'Pagar e transferir' },
    tema: { corPrincipal: '#005ca9', corDestaque: '#b34f00' },
  },
  {
    id: 'nubank',
    nomeNaLista: 'Nubank',
    arquetipo: 'digital',
    caminhoAteOPix: DIGITAL,
    rotulos: { pix: 'Pix', transferir: 'Enviar', confirmar: 'Transferir agora' },
    tema: { corPrincipal: '#820ad1', corDestaque: '#1b4b8f' },
  },
  {
    id: 'bradesco',
    nomeNaLista: 'Bradesco',
    arquetipo: 'tradicional',
    caminhoAteOPix: TRADICIONAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Confirmar', menu: 'Menu', pagar: 'Transferir' },
    tema: { corPrincipal: '#cc092f', corDestaque: '#1b4b8f' },
  },
  {
    id: 'itau',
    nomeNaLista: 'Itaú',
    arquetipo: 'tradicional',
    caminhoAteOPix: TRADICIONAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Pagar', menu: 'Menu', pagar: 'Transferências' },
    tema: { corPrincipal: '#b34f00', corDestaque: '#1b4b8f' },
  },
  {
    id: 'banco-do-brasil',
    nomeNaLista: 'Banco do Brasil',
    arquetipo: 'tradicional',
    caminhoAteOPix: TRADICIONAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Confirmar', menu: 'Menu', pagar: 'Pagamentos' },
    tema: { corPrincipal: '#0038a8', corDestaque: '#b34f00' },
  },
  {
    id: 'santander',
    nomeNaLista: 'Santander',
    arquetipo: 'tradicional',
    caminhoAteOPix: TRADICIONAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Confirmar', menu: 'Menu', pagar: 'Pagar e transferir' },
    tema: { corPrincipal: '#cc0000', corDestaque: '#1b4b8f' },
  },
  {
    id: 'mercado-pago',
    nomeNaLista: 'Mercado Pago',
    arquetipo: 'digital',
    caminhoAteOPix: DIGITAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Transferir', },
    tema: { corPrincipal: '#00709f', corDestaque: '#b34f00' },
  },
  {
    id: 'picpay',
    nomeNaLista: 'PicPay',
    arquetipo: 'digital',
    caminhoAteOPix: DIGITAL,
    rotulos: { pix: 'Pix', transferir: 'Enviar', confirmar: 'Pagar' },
    tema: { corPrincipal: '#0b7a3f', corDestaque: '#1b4b8f' },
  },
  {
    id: 'inter',
    nomeNaLista: 'Inter',
    arquetipo: 'digital',
    caminhoAteOPix: DIGITAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Confirmar', },
    tema: { corPrincipal: '#c24a00', corDestaque: '#1b4b8f' },
  },
  {
    id: 'outro',
    nomeNaLista: 'Outro banco / não sei',
    arquetipo: 'digital',
    caminhoAteOPix: DIGITAL,
    rotulos: { pix: 'Pix', transferir: 'Transferir', confirmar: 'Confirmar' },
    tema: { corPrincipal: '#1b4b8f', corDestaque: '#b34f00' },
  },
]

export function buscarBanco(id: string | null | undefined): BancoConfig | undefined {
  return bancos.find((b) => b.id === id)
}
