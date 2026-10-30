import type { BancoConfig, FluxoPix, InicioBanco } from '../core/engine/stepTypes'
import { telasInter } from './banco/telas/inter'
import { telasItau } from './banco/telas/itau'
import { telasMercadoPago } from './banco/telas/mercadopago'
import { telasPicPay } from './banco/telas/picpay'

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

// Tela inicial. A da Caixa segue uma captura de tela real (Caixa Tem, out/2026). As dos outros bancos
// usam a MESMA estrutura (cabeçalho, atalhos, lista) com atalhos genéricos, até recebermos capturas deles.
function inicioGenerico(entradaPix: string): InicioBanco {
  return {
    secaoAtalhos: 'Atalhos',
    colunas: 3,
    atalhos: [
      { rotulo: entradaPix, icone: '💠' },
      { rotulo: 'Pagar contas', icone: '🧾' },
      { rotulo: 'Extrato', icone: '📄' },
      { rotulo: 'Cartões', icone: '💳' },
      { rotulo: 'Investir', icone: '📈' },
      { rotulo: 'Recarga', icone: '📱' },
    ],
  }
}

export const bancos: BancoConfig[] = [
  {
    id: 'caixa',
    nomeNaLista: 'Caixa / Caixa Tem',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Pagar/Transferir', dica: 'Fica no menu do Pix, do lado esquerdo.' }],
      rotuloConfirmar: 'Continuar',
      confirmacao: { nome: 'assinatura eletrônica', digitos: 4 },
    },
    inicio: {
      secaoAtalhos: 'Movimente sua conta',
      secaoServicos: 'Serviços e Produtos',
      colunas: 3,
      atalhos: [
        { rotulo: 'Pix', icone: '💠' },
        { rotulo: 'Receba com Pix', icone: '💵' },
        { rotulo: 'Pague suas contas', icone: '🧾' },
        { rotulo: 'Extrato', icone: '📄' },
        { rotulo: 'Pague na maquininha', icone: '📟' },
        { rotulo: 'Saque sem cartão', icone: '💸' },
      ],
      servicos: [
        { rotulo: 'Pix', detalhe: 'Pagamento instantâneo', icone: '💠' },
        { rotulo: 'Cartão de crédito', detalhe: 'Consulte sua fatura', icone: '💳' },
        { rotulo: 'Crédito', detalhe: 'Veja as ofertas para você', icone: '🏦' },
      ],
    },
    tema: { corPrincipal: '#005ca9', corDestaque: '#b34f00' },
    fonte: 'Tela inicial: captura real do Caixa Tem (out/2026). Caminho depois do Pix: Canaltech, 2022; dígitos da assinatura não confirmados.',
  },
  {
    id: 'nubank',
    nomeNaLista: 'Nubank',
    fluxo: { ...PADRAO, entradaPix: 'Área Pix', ordem: 'valor-primeiro', extras: [] },
    inicio: inicioGenerico('Área Pix'),
    tema: { corPrincipal: '#820ad1', corDestaque: '#1b4b8f' },
    fonte: 'Mobills, jan/2024. Nome do botão final não confirmado.',
  },
  {
    id: 'bradesco',
    nomeNaLista: 'Bradesco',
    fluxo: {
      ...PADRAO,
      caminho: [],
      // Tela do Pix: rótulos lidos na imagem oficial do app na Google Play/App Store (2025).
      menuPix: {
        titulo: 'Como você quer transferir?',
        rotuloCampo: 'Digitar ou colar nome/chave',
        dicaCampo: 'Pode ser nome do contato ou uma chave Pix',
        botoes: [
          { rotulo: 'Escolher um contato', icone: '⭐' },
          { rotulo: 'Digitar agência e conta', icone: '🏦' },
        ],
        secaoMais: 'Mais opções',
        mais: [
          { rotulo: 'Pix Copia e Cola', icone: '📋' },
          { rotulo: 'Ler um QR Code', icone: '🔳' },
          { rotulo: 'Trazer dinheiro', icone: '⤵️' },
        ],
        secaoOutros: 'Outros Serviços',
        outros: [
          { rotulo: 'Pix Automático', icone: '🔁' },
          { rotulo: 'Resumo Pix', icone: '📊' },
          { rotulo: 'Extrato Pix', icone: '📄' },
          { rotulo: 'Minhas chaves Pix', icone: '🔑' },
          { rotulo: 'Gerenciar contatos', icone: '👥' },
          { rotulo: 'Limites Pix', icone: '⚖️' },
        ],
      },
      extras: ['conta'],
    },
    inicio: inicioGenerico('Pix'),
    tema: { corPrincipal: '#cc092f', corDestaque: '#1b4b8f' },
    fonte:
      'Tela do Pix: imagem oficial do app (Google Play, 2025). Tela inicial e etapas depois da chave (valor, conta, confirmação): Canaltech 2020/2022, NÃO conferidas no app atual; tipo de senha não confirmado.',
  },
  {
    id: 'itau',
    nomeNaLista: 'Itaú',
    fluxo: {
      ...PADRAO,
      entradaPix: 'Pix e transferir',
      caminho: [{ rotulo: 'Nova transferência' }],
      extras: ['confirmar-destinatario', 'conta'],
      contaDepoisDoValor: true,
      rotuloConfirmar: 'Confirmar transferência',
    },
    inicio: inicioGenerico('Pix e transferir'),
    telas: telasItau,
    tema: { corPrincipal: '#b34f00', corDestaque: '#1b4b8f', link: '#0a2a7a' },
    fonte:
      'Capturas reais do app (out/2026): início, Pix e transferir, Para quem, Quanto (com o nome de quem recebe) e Escolha a conta. Falta o que vem depois de escolher a conta: revisão, senha ou biometria e comprovante (telas genéricas).',
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
    inicio: inicioGenerico('Pix'),
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
    inicio: inicioGenerico('Pix'),
    tema: { corPrincipal: '#cc0000', corDestaque: '#1b4b8f' },
    fonte: 'Canaltech, 2020/2022. Nomes exatos dos botões não confirmados.',
  },
  {
    id: 'mercado-pago',
    nomeNaLista: 'Mercado Pago',
    fluxo: {
      ...PADRAO,
      caminho: [],
      rotuloConfirmar: 'Transferir',
    },
    inicio: inicioGenerico('Pix'),
    telas: telasMercadoPago,
    tema: { corPrincipal: '#3b3fc4', corDestaque: '#b34f00', faixa: { fundo: '#ffe600', texto: '#1d1d1d' } },
    fonte:
      'Capturas reais do app (out/2026): início e tela do Pix (campo "Informe o que você quer fazer"). Não sabemos o que vem depois de escrever a chave: valor, revisão, confirmação e comprovante usam a tela genérica.',
  },
  {
    id: 'picpay',
    nomeNaLista: 'PicPay',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Transferir' }],
      rotuloAvancar: 'Avançar',
      rotuloConfirmar: 'Pagar',
    },
    inicio: inicioGenerico('Pix'),
    telas: telasPicPay,
    tema: { corPrincipal: '#0b7a63', corDestaque: '#1b4b8f' },
    fonte:
      'Capturas reais do app (out/2026): início, Área Pix e "Escolha pra quem transferir". Valor, revisão, confirmação e comprovante ainda usam a tela genérica.',
  },
  {
    id: 'inter',
    nomeNaLista: 'Inter',
    fluxo: {
      ...PADRAO,
      caminho: [{ rotulo: 'Pagar' }],
      rotuloAvancar: 'Continuar',
      rotuloConfirmar: 'Pagar R$ 25,00',
      confirmacao: { nome: 'confirmação no app', digitos: 0 },
    },
    inicio: inicioGenerico('Pix'),
    telas: telasInter,
    tema: { corPrincipal: '#c24a00', corDestaque: '#1b4b8f', escuro: true, link: '#ff9a45' },
    fonte:
      'Capturas reais do app (out/2026): início, Pix, Pagar com Pix, Valor a pagar, Revisão e confirmação (iSafe). Falta o que vem depois do CONFIRMAR e o comprovante.',
  },
  {
    id: 'outro',
    nomeNaLista: 'Outro banco / não sei',
    fluxo: PADRAO,
    inicio: inicioGenerico('Pix'),
    tema: { corPrincipal: '#1b4b8f', corDestaque: '#b34f00' },
    fonte: 'Fluxo padrão, parecido com a maioria dos bancos.',
  },
]

export function buscarBanco(id: string | null | undefined): BancoConfig | undefined {
  return bancos.find((b) => b.id === id)
}
