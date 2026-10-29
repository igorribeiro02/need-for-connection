import type { BancoConfig, FluxoPix } from '../core/engine/stepTypes'

// Fluxos montados a partir de tutoriais publicados (2020 a 2024), NÃO dos aplicativos de hoje.
// Cada banco tem o campo `fonte`. Antes de testar com idosos, o grupo deve abrir o app de verdade e
// conferir: nomes dos botões, ordem das telas e confirmações. Onde a fonte não dizia, usamos o padrão.
// Não usamos logos nem cópias de tela. Cores: todas com contraste mínimo de 4,5:1 contra texto branco
// (conferido em tests/content.test.ts), por isso algumas são mais escuras que as do banco.

const PADRAO: FluxoPix = {
  entradaPix: 'Pix',
  caminho: [{ rotulo: 'Transferir' }],
  ordem: 'chave-primeiro',
  rotuloAvancar: 'Continuar',
  extras: [],
  rotuloConfirmar: 'Confirmar',
  confirmacao: { nome: 'senha', digitos: 4 },
}

export const bancos: BancoConfig[] = [
  {
    id: 'caixa',
    nomeNaLista: 'Caixa',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Pagar/Transferir', dica: 'Fica no menu do Pix, do lado esquerdo.' }],
      rotuloConfirmar: 'Continuar',
      confirmacao: { nome: 'assinatura eletrônica', digitos: 4 },
    },
    tema: { corPrincipal: '#005ca9', corDestaque: '#b34f00' },
    fonte: 'Canaltech, 2022. Dígitos da assinatura eletrônica não confirmados.',
  },
  {
    id: 'nubank',
    nomeNaLista: 'Nubank',
    fluxo: { ...PADRAO, entradaPix: 'Área Pix', ordem: 'valor-primeiro', extras: [] },
    tema: { corPrincipal: '#820ad1', corDestaque: '#1b4b8f' },
    fonte: 'Mobills, jan/2024. Nome do botão final não confirmado.',
  },
  {
    id: 'bradesco',
    nomeNaLista: 'Bradesco',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Transferir', dica: 'Pode ser preciso rolar a tela para baixo até achar.' }],
      extras: ['conta'],
    },
    tema: { corPrincipal: '#cc092f', corDestaque: '#1b4b8f' },
    fonte: 'Canaltech, 2020/2022. Tipo de senha não confirmado.',
  },
  {
    id: 'itau',
    nomeNaLista: 'Itaú',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Transferir' }, { rotulo: 'Chave' }],
      extras: ['confirmar-destinatario', 'conta'],
      rotuloConfirmar: 'Confirmar transferência',
    },
    tema: { corPrincipal: '#b34f00', corDestaque: '#1b4b8f' },
    fonte: 'Canaltech, 2020/2022. Tipo de senha não confirmado.',
  },
  {
    id: 'banco-do-brasil',
    nomeNaLista: 'Banco do Brasil',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Pagar ou transferir' }],
      rotuloAvancar: 'Avançar',
      extras: ['confirmar-destinatario', 'conta', 'data'],
      confirmacao: { nome: 'senha', digitos: 6 },
    },
    tema: { corPrincipal: '#0038a8', corDestaque: '#b34f00' },
    fonte: 'Canaltech, 2022 (senha de 6 dígitos).',
  },
  {
    id: 'santander',
    nomeNaLista: 'Santander',
    fluxo: {
      ...PADRAO,
      caminho: [
        { rotulo: 'Pagar com chave', dica: 'Escolha a opção de chaves, e não a de QR Code.' },
        { rotulo: 'Pagar para novo contato' },
      ],
    },
    tema: { corPrincipal: '#cc0000', corDestaque: '#1b4b8f' },
    fonte: 'Canaltech, 2020/2022. Nomes exatos dos botões não confirmados.',
  },
  {
    id: 'mercado-pago',
    nomeNaLista: 'Mercado Pago',
    fluxo: {
      ...PADRAO,
      entradaPix: 'Área Pix',
      caminho: [{ rotulo: 'Transferir' }, { rotulo: 'Nova transferência' }],
      rotuloConfirmar: 'Transferir',
    },
    tema: { corPrincipal: '#00709f', corDestaque: '#b34f00' },
    fonte: 'Olhar Digital, 2023.',
  },
  {
    id: 'picpay',
    nomeNaLista: 'PicPay',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Enviar', dica: 'É a primeira opção do grupo "Enviar".' }],
      rotuloAvancar: 'Avançar',
      rotuloConfirmar: 'Pagar',
    },
    tema: { corPrincipal: '#0b7a3f', corDestaque: '#1b4b8f' },
    fonte: 'Canaltech, 2020/2022.',
  },
  {
    id: 'inter',
    nomeNaLista: 'Inter',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Pagar com chave Pix', dica: 'Fica no grupo "Pagar".' }],
    },
    tema: { corPrincipal: '#c24a00', corDestaque: '#1b4b8f' },
    fonte: 'Canaltech, 2021/2022. Nome do botão não confirmado.',
  },
  {
    id: 'outro',
    nomeNaLista: 'Outro banco / não sei',
    fluxo: PADRAO,
    tema: { corPrincipal: '#1b4b8f', corDestaque: '#b34f00' },
    fonte: 'Fluxo padrão, parecido com a maioria dos bancos.',
  },
]

export function buscarBanco(id: string | null | undefined): BancoConfig | undefined {
  return bancos.find((b) => b.id === id)
}
