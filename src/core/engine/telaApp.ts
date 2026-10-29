// Ajudantes das telas de app montadas por blocos (sem React).

import type { BlocoApp, ItemApp, Passo, TelaApp } from './stepTypes'

export function slug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** O id de um botão: o `id` dele ou o rótulo em minúsculas. */
export function idDoItem(item: ItemApp): string {
  return item.id ?? slug(item.rotulo)
}

/** Todos os botões de um bloco, na ordem em que aparecem na tela. */
export function itensDoBloco(b: BlocoApp): ItemApp[] {
  switch (b.tipo) {
    case 'barra':
      return [...(typeof b.voltar === 'object' ? [b.voltar] : []), ...(b.acoes ?? [])]
    case 'faixa':
      return [...(b.acoes ?? []), ...(b.contas ?? [])]
    case 'saldo':
      return [...(b.olho ? [b.olho] : []), ...(b.botao ? [b.botao] : [])]
    case 'fichas':
    case 'atalhos':
      return b.itens
    case 'lista':
      return [...(b.acao ? [b.acao] : []), ...b.itens]
    case 'promo':
      return b.botao ? [b.botao] : []
    case 'titulo':
      return b.acao ? [b.acao] : []
    case 'destaque':
      return b.chip ? [b.chip] : []
    case 'botao':
      return [b.item]
    case 'folha':
      return [b.botao]
    case 'navegacao':
      return b.itens
    default:
      return []
  }
}

/** Botões que valem como resposta (os que não são só enfeite). */
export function itensTocaveis(tela: TelaApp): ItemApp[] {
  return tela.blocos.flatMap(itensDoBloco).filter((i) => !i.inerte)
}

/** `elementos` do passo, a partir dos botões da tela (os testes e o motor continuam enxergando os botões). */
export function elementosDaTela(tela: TelaApp): NonNullable<Passo['elementos']> {
  return itensTocaveis(tela).map((i) => ({ id: idDoItem(i), rotulo: i.rotulo, icone: i.icone }))
}
