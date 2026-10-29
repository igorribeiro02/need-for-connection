// Gera os passos do Pix para um banco. É aqui que os passos ficam "dinâmicos":
// o caminho até o Pix, os nomes dos botões e a posição de cada botão mudam por banco,
// e as dicas dizem onde o botão está ("é o segundo da lista").

import type { BancoConfig, Passo } from '../../core/engine/stepTypes'

export type VariantePix = 'normal' | 'nome-diferente'

// Dados inventados do exercício. Nada aqui é de uma pessoa real.
const DADOS = {
  nome: 'Ana Beatriz Souza',
  primeiroNome: 'Ana',
  email: 'ana@exemplo.com',
  valor: '25,00',
  senha: '1234',
  nomeEstranho: 'Carlos Alberto Lima',
  saldo: 'R$ 1.250,00',
}

type Elemento = { id: string; rotulo: string }

const ORDINAL = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto']

function hash(texto: string): number {
  let h = 7
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

/** Põe o botão certo numa posição que muda de banco para banco (sempre a mesma para o mesmo banco). */
function misturar(alvo: Elemento, enganos: string[], semente: string): Elemento[] {
  const lista: Elemento[] = enganos.map((rotulo, i) => ({ id: `outro-${i + 1}`, rotulo }))
  lista.splice(hash(semente) % (lista.length + 1), 0, alvo)
  return lista
}

function dicaDePosicao(lista: Elemento[], alvoId: string): string {
  const i = lista.findIndex((e) => e.id === alvoId)
  if (lista.length === 1) return 'É o único botão da tela.'
  if (i === lista.length - 1) return 'É o último botão da lista.'
  return `É o ${ORDINAL[i] ?? `${i + 1}º`} botão da lista, contando de cima para baixo.`
}

function passoToque(
  id: string,
  instrucao: string,
  tela: Passo['tela'],
  elementos: Elemento[],
  alvoId: string,
  rotuloAlvo: string,
  lembrete: string,
): Passo {
  return {
    id,
    instrucao,
    tipo: 'tocar',
    alvo: alvoId,
    tela,
    elementos,
    dicas: [`Procure o botão escrito "${rotuloAlvo}".`, dicaDePosicao(elementos, alvoId)],
    erroGentil: `Quase! Procure o botão escrito "${rotuloAlvo}".`,
    lembrete,
  }
}

const ICONE: Record<string, string> = { menu: '☰ ', pagar: '💸 ', pix: '💠 ' }

// O que cada tela do caminho mostra, além do botão que leva ao próximo passo.
const ORIGENS: Record<string, { titulo: string; enganos: string[] }> = {
  home: { titulo: 'Início', enganos: ['Extrato', 'Cartões', 'Investir'] },
  menu: { titulo: 'Menu', enganos: ['Meus dados', 'Extrato', 'Investimentos'] },
  pagar: { titulo: 'Pagar e transferir', enganos: ['Boleto', 'Transferência TED', 'Recarga de celular'] },
}

function rotuloDoNo(banco: BancoConfig, no: string): string {
  if (no === 'menu') return banco.rotulos.menu ?? 'Menu'
  if (no === 'pagar') return banco.rotulos.pagar ?? 'Pagar e transferir'
  return banco.rotulos.pix
}

function passosDoCaminho(banco: BancoConfig): Passo[] {
  const caminho = banco.caminhoAteOPix
  const passos: Passo[] = []
  for (let i = 0; i < caminho.length - 1; i++) {
    const de = caminho[i]
    const para = caminho[i + 1]
    const origem = ORIGENS[de] ?? ORIGENS.home
    const rotulo = rotuloDoNo(banco, para)
    const alvo = { id: para, rotulo: `${ICONE[para] ?? ''}${rotulo}` }
    const elementos = misturar(alvo, origem.enganos, `${banco.id}-${de}`)
    const linhas = de === 'home' ? [`Seu saldo: ${DADOS.saldo}`] : undefined
    const instrucao =
      para === 'pix' ? `Toque em ${rotulo}: é por onde se manda e se recebe dinheiro.` : `Toque em ${rotulo}.`
    passos.push(
      passoToque(
        `ir-${para}`,
        instrucao,
        { titulo: origem.titulo, linhas },
        elementos,
        para,
        rotulo,
        para === 'pix'
          ? `No aplicativo do banco, procure a palavra ${rotulo}. Ela pode estar na tela inicial ou dentro do menu.`
          : `Neste banco, o caminho até o Pix passa por "${rotulo}".`,
      ),
    )
  }
  return passos
}

export function montarPix(banco: BancoConfig, variante: VariantePix): Passo[] {
  const nomeNaTela = variante === 'nome-diferente' ? DADOS.nomeEstranho : DADOS.nome
  const resumo = [`Para: ${nomeNaTela}`, `E-mail: ${DADOS.email}`, `Valor: R$ ${DADOS.valor}`]

  const entrar: Passo = passoToque(
    'entrar',
    'Abra o aplicativo do banco: toque em Entrar.',
    {
      titulo: 'Bem-vindo',
      linhas: ['Aqui você usaria a sua digital, o seu rosto ou a sua senha para entrar.'],
    },
    [{ id: 'entrar', rotulo: 'Entrar' }],
    'entrar',
    'Entrar',
    'Abra o aplicativo do seu banco e entre com a sua digital, o seu rosto ou a sua senha.',
  )

  const saldo: Passo = passoToque(
    'saldo',
    'Veja quanto você tem: toque em Mostrar saldo.',
    { titulo: 'Início', linhas: ['Seu saldo: ••••••'] },
    misturar({ id: 'ver-saldo', rotulo: '👁 Mostrar saldo' }, ['Extrato'], `${banco.id}-saldo`),
    'ver-saldo',
    'Mostrar saldo',
    'O saldo costuma vir escondido. O desenho do olho, ou "Mostrar saldo", revela o valor.',
  )

  const aTransferir = passoToque(
    'transferir',
    `Toque em ${banco.rotulos.transferir}: é para mandar dinheiro a alguém.`,
    { titulo: 'Pix' },
    misturar({ id: 'transferir', rotulo: banco.rotulos.transferir }, ['Pix Copia e Cola', 'Ler QR Code', 'Minhas chaves'], `${banco.id}-pix`),
    'transferir',
    banco.rotulos.transferir,
    `Dentro do Pix, "${banco.rotulos.transferir}" serve para mandar dinheiro usando a chave da pessoa.`,
  )

  const tipoChave: Passo = {
    id: 'tipo-chave',
    instrucao: `A ${DADOS.primeiroNome} passou o e-mail dela para você pagar. Escolha E-mail.`,
    tipo: 'escolher',
    alvo: 'email',
    esperado: 'email',
    tela: { titulo: 'Para quem você quer enviar?', linhas: ['Escolha como encontrar a pessoa.'] },
    elementos: [
      { id: 'cpf', rotulo: 'CPF ou CNPJ' },
      { id: 'celular', rotulo: 'Celular' },
      { id: 'email', rotulo: 'E-mail' },
      { id: 'aleatoria', rotulo: 'Chave aleatória' },
    ],
    dicas: ['A chave é a "identidade" da pessoa no Pix: pode ser CPF, celular, e-mail ou um código.', 'Escolha a opção E-mail, a terceira da lista.'],
    erroGentil: 'Quase! A Ana passou o e-mail dela. Escolha E-mail.',
    lembrete: 'Pergunte à pessoa qual é a chave Pix dela (CPF, celular ou e-mail) e escolha o mesmo tipo no aplicativo.',
  }

  const chave: Passo = {
    id: 'chave',
    instrucao: `Digite o e-mail da ${DADOS.primeiroNome}: ${DADOS.email}`,
    tipo: 'digitar',
    alvo: 'campo',
    esperado: DADOS.email,
    teclado: 'email',
    rotuloCampo: 'E-mail da pessoa',
    rotuloBotao: 'Continuar',
    tela: { titulo: 'Digite a chave', linhas: ['Confira cada letra: um erro manda o dinheiro para outra pessoa.'] },
    dicas: ['Toque na caixa para abrir o teclado e escreva tudo junto, sem espaços.', `Escreva: ${DADOS.email}`],
    erroGentil: `Quase! Confira se está escrito ${DADOS.email}, sem espaços.`,
    lembrete: 'Digite a chave com calma e confira cada letra antes de continuar. Um erro manda o dinheiro para outra pessoa.',
  }

  const valor: Passo = {
    id: 'valor',
    instrucao: `Digite o valor: ${DADOS.valor.replace(',00', '')} reais.`,
    tipo: 'digitar',
    alvo: 'campo',
    esperado: ['25', '25,00', '25.00', 'r$ 25,00', 'r$25,00'],
    teclado: 'valor',
    rotuloCampo: 'Valor em reais',
    rotuloBotao: 'Continuar',
    tela: { titulo: 'Quanto você quer enviar?' },
    dicas: ['Digite só os números. Pode escrever 25 ou 25,00.', 'Escreva: 25'],
    erroGentil: 'Quase! O valor deste exercício é 25 reais. Escreva 25.',
    lembrete: 'Confira o valor e as vírgulas: 25,00 é vinte e cinco reais; 250,00 é dez vezes mais.',
  }

  const revisar: Passo =
    variante === 'normal'
      ? {
          id: 'revisar',
          instrucao: `Confira: o nome é da ${DADOS.primeiroNome} e o valor é R$ ${DADOS.valor}? Se sim, toque em "Sim, está certo".`,
          tipo: 'escolher',
          alvo: 'sim',
          esperado: 'sim',
          tela: { titulo: 'Confira antes de enviar', linhas: resumo },
          elementos: [
            { id: 'sim', rotulo: 'Sim, está certo' },
            { id: 'nao', rotulo: 'Não, está diferente' },
          ],
          dicas: ['Leia o nome e o valor na tela. Eles batem com o que você queria?', 'Está tudo certo: toque em "Sim, está certo".'],
          erroGentil: 'Leia de novo: o nome é da Ana e o valor é R$ 25,00. Está tudo certo.',
          lembrete: 'Antes de confirmar, leia o nome de quem vai receber e o valor. É a sua última chance de evitar um erro.',
        }
      : {
          id: 'revisar',
          instrucao: `Confira: o nome na tela é o da ${DADOS.primeiroNome}? Se for de outra pessoa, toque em "Não, está diferente".`,
          tipo: 'escolher',
          alvo: 'nao',
          esperado: 'nao',
          tela: { titulo: 'Confira antes de enviar', linhas: resumo },
          elementos: [
            { id: 'sim', rotulo: 'Sim, está certo' },
            { id: 'nao', rotulo: 'Não, está diferente' },
          ],
          dicas: [`Você quer pagar a ${DADOS.primeiroNome}. Que nome aparece na tela?`, `O nome na tela é ${DADOS.nomeEstranho}, e não ${DADOS.nome}. Toque em "Não, está diferente".`],
          erroGentil: `Atenção! O nome na tela não é o da ${DADOS.primeiroNome}. Se o nome estiver diferente, não envie.`,
          lembrete: 'Nome diferente do que você esperava? Não envie. Pare e confirme a chave com a pessoa, por outro meio, como ligar para ela.',
        }

  const botaoConfirmar: Elemento = { id: 'confirmar', rotulo: banco.rotulos.confirmar }
  const botaoCancelar: Elemento = { id: 'cancelar', rotulo: 'Cancelar' }
  const ordemConfirmar = hash(`${banco.id}-confirmar`) % 2 === 0 ? [botaoConfirmar, botaoCancelar] : [botaoCancelar, botaoConfirmar]

  const confirmar: Passo = passoToque(
    'confirmar',
    `Tudo certo. Toque em ${banco.rotulos.confirmar}.`,
    { titulo: 'Confirmar o Pix', linhas: resumo },
    ordemConfirmar,
    'confirmar',
    banco.rotulos.confirmar,
    `O botão "${banco.rotulos.confirmar}" envia o dinheiro de verdade. Só toque nele depois de conferir nome e valor.`,
  )

  const cancelar: Passo = {
    ...passoToque(
      'cancelar',
      'Toque em Cancelar. Depois, confirme a chave com a Ana, por outro meio.',
      { titulo: 'Confirmar o Pix', linhas: resumo },
      ordemConfirmar,
      'cancelar',
      'Cancelar',
      'Cancelar é sempre permitido. Nada foi enviado. Confirme a chave com a pessoa antes de tentar de novo.',
    ),
  }

  const senha: Passo = {
    id: 'senha',
    instrucao: 'Digite a senha do exercício: 1234.',
    tipo: 'digitar',
    alvo: 'campo',
    esperado: DADOS.senha,
    teclado: 'senha',
    rotuloBotao: 'Confirmar',
    tela: {
      titulo: 'Digite a sua senha',
      linhas: ['Senha só do exercício: 1234.', 'No banco de verdade, ninguém pede a sua senha por telefone, mensagem ou e-mail.'],
    },
    dicas: ['Toque nos números 1, 2, 3 e 4, nesta ordem.', 'Depois toque em Confirmar.'],
    erroGentil: 'Quase! A senha do exercício é 1234. Use ⌫ para apagar e tente de novo.',
    lembrete: 'A senha é só sua. Nunca diga a senha nem o código recebido por mensagem a ninguém, nem a quem diz ser do banco.',
  }

  const comprovante = passoToque(
    'comprovante',
    'O Pix foi enviado! Toque em Salvar comprovante.',
    {
      titulo: 'Pix enviado ✓',
      linhas: [`R$ ${DADOS.valor} para ${DADOS.nome}`, 'Hoje, no horário do exercício'],
    },
    misturar({ id: 'salvar', rotulo: 'Salvar comprovante' }, ['Compartilhar', 'Voltar ao início'], `${banco.id}-comprovante`),
    'salvar',
    'Salvar comprovante',
    'Guarde o comprovante: ele prova que você pagou e mostra para quem.',
  )

  const prefixo = [entrar, saldo, ...passosDoCaminho(banco), aTransferir, tipoChave, chave, valor, revisar]
  return variante === 'normal' ? [...prefixo, confirmar, senha, comprovante] : [...prefixo, cancelar]
}
