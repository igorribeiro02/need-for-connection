import type { BlocoApp, TelaApp } from '../../core/engine/stepTypes'
import { VIAGEM } from './dados'

// Telas desenhadas a partir da ESTRUTURA de 9 capturas reais (Uber e 99, nov/2026). Endereços, preços, nomes e formas
// de pagamento foram trocados por dados inventados. Ainda NÃO vimos em captura: busca de motorista, motorista a caminho,
// código da viagem, cancelar e avaliação (a tela do motorista vem de tutoriais). Sem logos.

const resultados = (): BlocoApp => ({
  tipo: 'lista',
  estilo: 'linhas',
  itens: [
    { rotulo: VIAGEM.destino, detalhe: `${VIAGEM.enderecoDestino} · 12 km`, icone: '📍', id: 'lugar-certo' },
    { rotulo: `${VIAGEM.destino} Norte`, detalhe: 'Rodovia BR-101, km 8 · 24 km', icone: '📍', id: 'lugar-outro-1' },
    { rotulo: 'Mercado Municipal', detalhe: 'Rua Sete, 33 · 2 km', icone: '📍', id: 'lugar-outro-2' },
  ],
})

const recentes: BlocoApp = {
  tipo: 'lista',
  itens: [
    { rotulo: 'Farmácia Saúde', detalhe: 'Rua Doze, 45 - Centro', icone: '🕒', inerte: true },
    { rotulo: 'Posto de Saúde', detalhe: 'Av. das Palmeiras, 300', icone: '🕒', inerte: true },
  ],
}

// ---------------- Uber (tema escuro) ----------------
const navUber: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Início', icone: '🏠', inerte: true },
    { rotulo: 'Opções', icone: '▦', inerte: true },
    { rotulo: 'Atividade', icone: '🧾', inerte: true },
    { rotulo: 'Conta', icone: '👤', inerte: true },
  ],
}

const topoPlaneje = (): BlocoApp[] => [
  { tipo: 'barra', titulo: 'Planeje sua próxima viagem', voltar: true, grande: 'abaixo' },
  {
    tipo: 'fichas',
    itens: [
      { rotulo: 'Ir agora ⌄', inerte: true },
      { rotulo: 'Para mim ⌄', inerte: true },
    ],
  },
  { tipo: 'dados', linhas: [{ rotulo: 'Saída', valor: VIAGEM.partida }] },
]

const itensUber = (sel: 'comfort' | 'uberx') =>
  [
    { rotulo: 'Comfort', id: 'comfort', icone: sel === 'comfort' ? '✅' : '🚘', detalhe: 'R$ 27,50 · 8 min · mais espaço' },
    { rotulo: 'UberX', id: 'uberx', icone: sel === 'uberx' ? '✅' : '🚗', detalhe: 'R$ 21,90 · 7 min · mais barato' },
    { rotulo: 'Prioridade', id: 'prioridade', icone: '⚡', detalhe: 'R$ 25,90 · 6 min · mais rápido' },
    { rotulo: 'Moto', id: 'moto', icone: '🏍️', detalhe: 'R$ 15,90 · 5 min · 1 passageiro' },
  ]

export const uber = {
  inicio: (): TelaApp => ({
    escuro: true,
    blocos: [
      { tipo: 'promo', titulo: 'R$ 4,98 até 3 km', texto: 'Só de moto. Sem cupom. (oferta de exemplo)' },
      { tipo: 'titulo', texto: 'Localização atual', acao: { rotulo: 'Caixa de entrada', icone: '🔔', inerte: true } },
      { tipo: 'fichas', ativa: 0, itens: [{ rotulo: 'Uber', icone: '🚗', inerte: true }, { rotulo: 'Envios', icone: '📦', inerte: true }] },
      { tipo: 'pesquisa', item: { rotulo: 'Para onde?', icone: '🔍', id: 'para-onde' } },
      recentes,
      {
        tipo: 'atalhos',
        titulo: 'Para você',
        estilo: 'redondos',
        itens: [
          { rotulo: 'Enviar itens', icone: '📦', inerte: true },
          { rotulo: 'Viagem', icone: '🚗', etiqueta: '10%', inerte: true },
          { rotulo: 'Moto', icone: '🏍️', inerte: true },
        ],
      },
      navUber,
    ],
  }),
  destino: (): TelaApp => ({
    escuro: true,
    blocos: [...topoPlaneje(), { tipo: 'campo', icone: '🔍' }, recentes],
  }),
  resultados: (): TelaApp => ({
    escuro: true,
    blocos: [
      ...topoPlaneje(),
      { tipo: 'dados', linhas: [{ rotulo: 'Chegada', valor: VIAGEM.destino }] },
      resultados(),
      {
        tipo: 'lista',
        itens: [
          { rotulo: 'Pesquisar em uma cidade diferente', icone: '🌐', inerte: true },
          { rotulo: 'Definir a localização no mapa', icone: '📍', inerte: true },
        ],
      },
    ],
  }),
  /** Como no app real, o carro mais caro (Comfort) já vem marcado: quem não olha pede o carro errado. */
  categorias: (sel: 'comfort' | 'uberx'): TelaApp => ({
    escuro: true,
    blocos: [
      { tipo: 'barra', voltar: true, titulo: `${VIAGEM.partida} → ${VIAGEM.destino}` },
      { tipo: 'texto', texto: '🏷️ Promoção de 10% aplicada', centro: true },
      { tipo: 'lista', estilo: 'caixas', itens: itensUber(sel) },
      { tipo: 'lista', itens: [{ rotulo: 'Pix', icone: '◈', id: 'pagamento', detalhe: 'Forma de pagamento' }] },
      {
        tipo: 'botao',
        item: sel === 'uberx' ? { rotulo: 'Escolher UberX', id: 'confirmar-uber' } : { rotulo: 'Escolher Comfort', inerte: true },
      },
    ],
  }),
  pagamento: (): TelaApp => ({
    escuro: true,
    blocos: [
      { tipo: 'barra', voltar: { rotulo: 'Fechar', icone: '✕', id: 'fechar-pagamento' }, titulo: 'Pague com', grande: 'abaixo' },
      { tipo: 'fichas', ativa: 0, itens: [{ rotulo: 'Pessoal', inerte: true }, { rotulo: 'Corporativo', inerte: true }] },
      { tipo: 'dados', titulo: 'Saldo Uber', linhas: [{ rotulo: 'Créditos Uber', valor: 'R$ 0,00' }] },
      {
        tipo: 'lista',
        titulo: 'Formas de pagamento',
        itens: [
          { rotulo: 'Pix', detalhe: 'Selecionado ✓', icone: '◈', inerte: true },
          { rotulo: 'Cartão de débito ••••0000', icone: '💳', inerte: true },
          { rotulo: 'Pagamento na hora', detalhe: 'Dinheiro ou QR Code Pix', icone: '💵', inerte: true },
          { rotulo: 'Adicionar forma de pagamento', icone: '➕', inerte: true },
        ],
      },
    ],
  }),
  partida: (): TelaApp => ({
    escuro: true,
    blocos: [
      { tipo: 'barra', voltar: true },
      { tipo: 'cartao', titulo: '🗺️ Mapa de mentira', texto: 'Partida aqui', link: 'No app de verdade, você pode mover o marcador' },
      { tipo: 'titulo', texto: 'Confirme o local de partida', apoio: VIAGEM.partida },
      {
        tipo: 'lista',
        estilo: 'caixas',
        itens: [
          { rotulo: `Perto de ${VIAGEM.partida}`, detalhe: 'Local escolhido', icone: '📍', inerte: true },
          { rotulo: 'Rua Vizinha', detalhe: `Perto de ${VIAGEM.partida}`, icone: '📍', inerte: true },
        ],
      },
      { tipo: 'botao', item: { rotulo: 'Confirmar partida', id: 'confirmar-partida' } },
    ],
  }),
  /** Tela com os dados do motorista. `placa` é a placa do carro que está parado na sua frente (na vida real). */
  motorista: (codigo: boolean): TelaApp => ({
    escuro: true,
    blocos: [
      { tipo: 'titulo', texto: 'O motorista chega em 4 min' },
      {
        tipo: 'dados',
        titulo: `Seu motorista: ${VIAGEM.motorista}`,
        linhas: [
          { rotulo: 'Carro', valor: VIAGEM.carro },
          { rotulo: 'Placa', valor: VIAGEM.placa },
        ],
      },
      ...(codigo
        ? ([{ tipo: 'cartao', titulo: `Código da viagem: ${VIAGEM.codigo}`, texto: 'Diga este código ao motorista antes de entrar.' }] as BlocoApp[])
        : []),
      { tipo: 'texto', texto: 'Antes de entrar, compare a placa e o modelo do carro com esta tela.', centro: true },
    ],
  }),
}

// ---------------- 99 (faixa amarela) ----------------
const nav99: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Carro', icone: '🚗', inerte: true },
    { rotulo: 'Food', icone: '🍴', inerte: true },
    { rotulo: 'Entrega', icone: '📦', inerte: true },
    { rotulo: 'Pay', icone: '$', inerte: true },
  ],
}

const topo99 = (): BlocoApp[] => [
  { tipo: 'barra', voltar: true, acoes: [{ rotulo: 'Mudar o passageiro', icone: '👤', inerte: true }] },
  { tipo: 'dados', linhas: [{ rotulo: 'Saída', valor: VIAGEM.partida }] },
]

const itens99 = () => [
  { rotulo: 'Pop', id: 'pop', icone: '✅', detalhe: 'R$ 22,40 · 7 min · 4 lugares' },
  { rotulo: 'Moto', id: 'moto', icone: '🏍️', detalhe: 'R$ 12,90 · 4 min · 1 lugar' },
  { rotulo: 'Pop Expresso', id: 'pop-expresso', icone: '⚡', detalhe: 'R$ 31,80 · 5 min · mais rápido' },
  { rotulo: 'Negocia', id: 'negocia', icone: '🤝', detalhe: 'Você escolhe o preço: − R$ 20,00 +' },
  { rotulo: 'Táxi', id: 'taxi', icone: '🚕', detalhe: 'aprox. R$ 36,50 · 6 min' },
]

export const app99 = {
  inicio: (): TelaApp => ({
    blocos: [
      { tipo: 'faixa', avatar: '{iniciais}', saudacao: 'Olá, {nome}!', acoes: [{ rotulo: 'Pix', icone: '◈', inerte: true }] },
      { tipo: 'pesquisa', item: { rotulo: 'Para onde vamos?', icone: '🔍', id: 'para-onde' } },
      recentes,
      { tipo: 'promo', titulo: 'Complete o check-in', texto: 'Cupons de desconto (oferta de exemplo)' },
      { tipo: 'espaco' },
      nav99,
    ],
  }),
  destino: (): TelaApp => ({
    blocos: [
      ...topo99(),
      { tipo: 'campo', icone: '🏁' },
      { tipo: 'fichas', itens: [{ rotulo: 'Casa', icone: '🏠', inerte: true }, { rotulo: 'Trabalho', icone: '💼', inerte: true }, { rotulo: 'Favoritos', icone: '⭐', inerte: true }] },
      recentes,
    ],
  }),
  resultados: (): TelaApp => ({
    blocos: [...topo99(), { tipo: 'dados', linhas: [{ rotulo: 'Chegada', valor: VIAGEM.destino }] }, resultados()],
  }),
  /** Como no app real, o Pop já vem marcado e o botão mostra o preço. Dá para marcar mais de uma categoria. */
  categorias: (): TelaApp => ({
    blocos: [
      { tipo: 'barra', voltar: true, titulo: `${VIAGEM.partida} → ${VIAGEM.destino}` },
      { tipo: 'texto', texto: 'Escolha uma ou mais categorias', centro: true },
      { tipo: 'lista', estilo: 'caixas', itens: itens99() },
      { tipo: 'lista', itens: [{ rotulo: 'Pix (pré-pago)', icone: '◈', detalhe: 'Clique para descontos', inerte: true }] },
      { tipo: 'botao', item: { rotulo: 'R$ 22,40 · Solicitar Pop', id: 'solicitar-pop' } },
    ],
  }),
  embarque: (): TelaApp => ({
    blocos: [
      { tipo: 'barra', voltar: true },
      { tipo: 'cartao', titulo: '🗺️ Mapa de mentira', texto: `Embarque em ${VIAGEM.partida}`, link: 'No app de verdade, você pode mover o marcador' },
      { tipo: 'dados', titulo: 'Local de embarque anterior', linhas: [{ rotulo: 'Local', valor: VIAGEM.partida }] },
      { tipo: 'botao', item: { rotulo: 'Editar', inerte: true } },
      { tipo: 'botao', item: { rotulo: 'Solicitar', id: 'solicitar' } },
    ],
  }),
}
