import type { BlocoApp, TelaApp } from '../../core/engine/stepTypes'
import { VIAGEM } from './dados'

// Telas copiadas da ESTRUTURA descrita em tutoriais e páginas oficiais (Uber, 99), NÃO de capturas de tela.
// O que não vem de fonte (ícones, preços, ordem dos itens do menu) está marcado como "não conferido" em cada app.
// Cores, ícones e textos de exemplo são nossos. Sem logos.

const rotaDados: BlocoApp = {
  tipo: 'dados',
  linhas: [
    { rotulo: 'Saída', valor: VIAGEM.partida },
    { rotulo: 'Chegada', valor: VIAGEM.destino },
  ],
}

const sugestoes: BlocoApp = {
  tipo: 'lista',
  titulo: 'Lugares recentes',
  itens: [
    { rotulo: 'Casa', icone: '🏠', inerte: true },
    { rotulo: 'Farmácia Saúde', icone: '🕒', inerte: true },
    { rotulo: 'Posto de Saúde', icone: '🕒', inerte: true },
  ],
}

// ---------------- Uber ----------------
const navUber: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Início', icone: '🏠', inerte: true },
    { rotulo: 'Serviços', icone: '▦', inerte: true },
    { rotulo: 'Atividade', icone: '🕘', inerte: true },
    { rotulo: 'Conta', icone: '👤', inerte: true },
  ],
}

export const uber = {
  inicio: (): TelaApp => ({
    blocos: [
      { tipo: 'titulo', texto: 'Olá, {nome}' },
      { tipo: 'pesquisa', item: { rotulo: 'Para onde?', icone: '🔍', id: 'para-onde' } },
      {
        tipo: 'atalhos',
        estilo: 'caixas',
        itens: [
          { rotulo: 'Viagem', icone: '🚗', inerte: true },
          { rotulo: 'Moto', icone: '🏍️', inerte: true },
          { rotulo: 'Entrega', icone: '📦', inerte: true },
        ],
      },
      sugestoes,
      { tipo: 'espaco' },
      navUber,
    ],
  }),
  destino: (): TelaApp => ({
    blocos: [
      { tipo: 'barra', titulo: 'Seu trajeto', voltar: true },
      { tipo: 'dados', linhas: [{ rotulo: 'Saída', valor: `${VIAGEM.partida} (local atual)` }] },
      { tipo: 'campo', icone: '🔍' },
      sugestoes,
    ],
  }),
  /** `selecionada`: depois de tocar em UberX, a tela mostra a escolha, o pagamento e o botão de confirmar. */
  categorias: (selecionada: boolean): TelaApp => ({
    blocos: [
      { tipo: 'barra', titulo: 'Escolha uma viagem', voltar: true },
      rotaDados,
      {
        tipo: 'lista',
        estilo: 'caixas',
        itens: [
          { rotulo: 'UberX', id: 'uberx', icone: selecionada ? '✅' : '🚗', detalhe: 'R$ 18,90 · 4 min · mais barato' },
          { rotulo: 'Comfort', id: 'comfort', icone: '🚘', detalhe: 'R$ 24,50 · 6 min · mais espaço' },
          { rotulo: 'Black', id: 'black', icone: '🖤', detalhe: 'R$ 39,90 · 8 min · carro de luxo' },
        ],
      },
      ...(selecionada
        ? ([
            { tipo: 'dados', titulo: 'Como você vai pagar', linhas: [{ rotulo: 'Pagamento', valor: 'Dinheiro' }] },
            { tipo: 'botao', item: { rotulo: 'Confirmar UberX', id: 'confirmar-uber' } },
          ] as BlocoApp[])
        : ([{ tipo: 'texto', texto: 'Toque em uma opção para escolher. Os preços são de exemplo.', centro: true }] as BlocoApp[])),
    ],
  }),
  partida: (): TelaApp => ({
    blocos: [
      { tipo: 'barra', titulo: 'Confirme o local de partida', voltar: true },
      { tipo: 'cartao', titulo: '🗺️ Mapa de mentira', texto: `📍 ${VIAGEM.partida}`, link: 'No app de verdade, você pode mover o marcador' },
      { tipo: 'espaco' },
      { tipo: 'botao', item: { rotulo: 'Confirmar', id: 'confirmar-partida' } },
    ],
  }),
  /** Tela com os dados do motorista. `placa` é a placa do carro que está parado na sua frente (na vida real). */
  motorista: (codigo: boolean): TelaApp => ({
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

// ---------------- 99 ----------------
const nav99: BlocoApp = {
  tipo: 'navegacao',
  ativo: 0,
  itens: [
    { rotulo: 'Início', icone: '🏠', inerte: true },
    { rotulo: 'Atividade', icone: '🕘', inerte: true },
    { rotulo: 'Pagamento', icone: '💳', inerte: true },
    { rotulo: 'Conta', icone: '👤', inerte: true },
  ],
}

export const app99 = {
  inicio: (): TelaApp => ({
    blocos: [
      { tipo: 'faixa', avatar: '{iniciais}', saudacao: 'Olá, {nome}' },
      { tipo: 'pesquisa', item: { rotulo: 'Para onde vamos?', icone: '🔍', id: 'para-onde' } },
      sugestoes,
      { tipo: 'espaco' },
      nav99,
    ],
  }),
  destino: (): TelaApp => ({
    blocos: [
      { tipo: 'barra', titulo: 'Para onde vamos?', voltar: true },
      { tipo: 'dados', linhas: [{ rotulo: 'Saída', valor: `${VIAGEM.partida} (local atual)` }] },
      { tipo: 'campo', icone: '🔍' },
      sugestoes,
    ],
  }),
  categorias: (selecionada: boolean): TelaApp => ({
    blocos: [
      { tipo: 'barra', titulo: 'Escolha a categoria', voltar: true },
      rotaDados,
      {
        tipo: 'lista',
        estilo: 'caixas',
        itens: [
          { rotulo: 'Poupa', id: 'poupa', icone: '🚗', detalhe: 'R$ 15,90 · 7 min · mais barato' },
          { rotulo: 'Pop', id: 'pop', icone: selecionada ? '✅' : '🚙', detalhe: 'R$ 18,50 · 4 min · o mais comum' },
          { rotulo: 'Comfort', id: 'comfort', icone: '🚘', detalhe: 'R$ 23,90 · 6 min · mais espaço' },
          { rotulo: 'Táxi comum', id: 'taxi', icone: '🚕', detalhe: 'preço pelo taxímetro' },
        ],
      },
      ...(selecionada
        ? ([
            { tipo: 'dados', titulo: 'Como você vai pagar', linhas: [{ rotulo: 'Pagamento', valor: 'Dinheiro' }] },
            { tipo: 'botao', item: { rotulo: 'Confirmar', id: 'confirmar' } },
          ] as BlocoApp[])
        : ([{ tipo: 'texto', texto: 'Toque em uma opção para escolher. Os preços são de exemplo.', centro: true }] as BlocoApp[])),
    ],
  }),
  partida: (): TelaApp => ({
    blocos: [
      { tipo: 'barra', titulo: 'Confirme o local de embarque', voltar: true },
      { tipo: 'cartao', titulo: '🗺️ Mapa de mentira', texto: `📍 ${VIAGEM.partida}`, link: 'No app de verdade, você pode mover o marcador' },
      { tipo: 'espaco' },
      { tipo: 'botao', item: { rotulo: 'Tudo certo, pode chamar!', id: 'tudo-certo' } },
    ],
  }),
}
