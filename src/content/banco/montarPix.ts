// Gera os passos do Pix para um banco, seguindo o fluxo dele (content/banks.ts):
// o atalho do Pix, os botões do caminho, a ordem chave/valor, telas extras e a confirmação mudam por banco.
// As dicas dizem onde o botão está ("é o segundo da lista").

import type { BancoConfig, Passo } from '../../core/engine/stepTypes'

export type VariantePix = 'normal' | 'nome-diferente'

// Dados inventados do exercício. Nada aqui é de uma pessoa real.
const DADOS = {
  nome: 'Ana Beatriz Souza',
  primeiroNome: 'Ana',
  email: 'ana@exemplo.com',
  valor: '25,00',
  nomeEstranho: 'Carlos Alberto Lima',
  saldo: 'R$ 1.250,00',
}
const SENHA_TREINO = '123456'

type Elemento = { id: string; rotulo: string; icone?: string }
type Tela = NonNullable<Passo['tela']>

const ORDINAL = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto']

function hash(texto: string): number {
  let h = 7
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

/** Põe o botão certo numa posição que muda de banco para banco (sempre a mesma para o mesmo banco). */
function misturar(alvo: Elemento, enganos: Elemento[], semente: string): Elemento[] {
  const lista = enganos.map((e, i) => ({ ...e, id: `outro-${i + 1}` }))
  lista.splice(hash(semente) % (lista.length + 1), 0, alvo)
  return lista
}

const enganos = (...rotulos: string[]): Elemento[] => rotulos.map((rotulo) => ({ id: '', rotulo }))

function dicaDePosicao(lista: Elemento[], alvoId: string, grade: boolean): string {
  const i = lista.findIndex((e) => e.id === alvoId)
  if (lista.length === 1) return 'É o único botão da tela.'
  if (grade) return `É o ${ORDINAL[i] ?? `${i + 1}º`} atalho, contando da esquerda para a direita e de cima para baixo.`
  if (i === lista.length - 1) return 'É o último botão da lista.'
  return `É o ${ORDINAL[i] ?? `${i + 1}º`} botão da lista, contando de cima para baixo.`
}

function passoToque(
  id: string,
  instrucao: string,
  tela: Tela,
  elementos: Elemento[],
  alvoId: string,
  rotuloAlvo: string,
  lembrete: string,
  dicaExtra?: string,
): Passo {
  const dicas = [`Procure o botão escrito "${rotuloAlvo}".`]
  if (dicaExtra) dicas.push(dicaExtra)
  dicas.push(dicaDePosicao(elementos, alvoId, tela.layout === 'grade'))
  return {
    id,
    instrucao,
    tipo: 'tocar',
    alvo: alvoId,
    tela,
    elementos,
    dicas,
    erroGentil: `Quase! Procure o botão escrito "${rotuloAlvo}".`,
    lembrete,
  }
}

function passoEscolha(
  id: string,
  instrucao: string,
  tela: Tela,
  elementos: Elemento[],
  certo: string,
  dicas: string[],
  erroGentil: string,
  lembrete: string,
): Passo {
  return { id, instrucao, tipo: 'escolher', alvo: certo, esperado: certo, tela, elementos, dicas, erroGentil, lembrete }
}

export function montarPix(banco: BancoConfig, variante: VariantePix): Passo[] {
  const f = banco.fluxo
  const semente = banco.id
  const nomeNaTela = variante === 'nome-diferente' ? DADOS.nomeEstranho : DADOS.nome
  const digitos = f.confirmacao.digitos
  const senha = SENHA_TREINO.slice(0, digitos)
  const confirmaNoDestinatario = f.extras.includes('confirmar-destinatario')
  const valorPrimeiro = f.ordem === 'valor-primeiro'

  // ---- tela inicial e caminho até a escolha da chave ----
  const entrar = passoToque(
    'entrar',
    'Abra o aplicativo do banco: toque em Entrar.',
    { titulo: 'Bem-vindo', linhas: ['Aqui você usaria a sua digital, o seu rosto ou a sua senha para entrar.'] },
    [{ id: 'entrar', rotulo: 'Entrar' }],
    'entrar',
    'Entrar',
    'Abra o aplicativo do seu banco e entre com a sua digital, o seu rosto ou a sua senha.',
  )

  const saldo = passoToque(
    'saldo',
    'Veja quanto você tem: toque em Mostrar saldo.',
    { titulo: 'Início', saldo: '••••••' },
    misturar({ id: 'ver-saldo', rotulo: 'Mostrar saldo', icone: '👁' }, enganos('Extrato'), `${semente}-saldo`),
    'ver-saldo',
    'Mostrar saldo',
    'O saldo costuma vir escondido. O desenho do olho, ou "Mostrar saldo", revela o valor.',
  )

  const atalhos = misturar(
    { id: 'pix', rotulo: f.entradaPix, icone: '💠' },
    [
      { id: '', rotulo: 'Extrato', icone: '🧾' },
      { id: '', rotulo: 'Cartões', icone: '💳' },
      { id: '', rotulo: 'Investir', icone: '📈' },
    ],
    `${semente}-home`,
  )
  const irPix = passoToque(
    'ir-pix',
    `Toque em ${f.entradaPix}: é por onde se manda e se recebe dinheiro.`,
    { titulo: 'Início', saldo: DADOS.saldo, layout: 'grade' },
    atalhos,
    'pix',
    f.entradaPix,
    `No aplicativo do banco, procure a palavra ${f.entradaPix}, na tela inicial.`,
  )

  const decoys = [
    enganos('Ler QR Code', 'Pix Copia e Cola', 'Minhas chaves'),
    enganos('Ler QR Code', 'Contatos salvos'),
    enganos('Cancelar'),
  ]
  const caminho = f.caminho.map((no, i) => {
    const titulo = i === 0 ? 'Pix' : f.caminho[i - 1].rotulo
    const elementos = misturar({ id: `caminho-${i}`, rotulo: no.rotulo }, decoys[Math.min(i, 2)], `${semente}-c${i}`)
    return passoToque(
      `caminho-${i + 1}`,
      `Toque em ${no.rotulo}.`,
      { titulo },
      elementos,
      `caminho-${i}`,
      no.rotulo,
      `Neste banco, para pagar por chave, toque em "${no.rotulo}".`,
      no.dica,
    )
  })

  // ---- dados do Pix ----
  const tipoChave = passoEscolha(
    'tipo-chave',
    `A ${DADOS.primeiroNome} passou o e-mail dela para você pagar. Escolha E-mail.`,
    { titulo: 'Para quem você quer enviar?', linhas: ['Escolha como encontrar a pessoa.'] },
    [
      { id: 'cpf', rotulo: 'CPF ou CNPJ' },
      { id: 'celular', rotulo: 'Celular' },
      { id: 'email', rotulo: 'E-mail' },
      { id: 'aleatoria', rotulo: 'Chave aleatória' },
    ],
    'email',
    ['A chave é a "identidade" da pessoa no Pix: pode ser CPF, celular, e-mail ou um código.', 'Escolha a opção E-mail, a terceira da lista.'],
    'Quase! A Ana passou o e-mail dela. Escolha E-mail.',
    'Pergunte à pessoa qual é a chave Pix dela (CPF, celular ou e-mail) e escolha o mesmo tipo no aplicativo.',
  )

  const chave: Passo = {
    id: 'chave',
    instrucao: `Digite o e-mail da ${DADOS.primeiroNome}: ${DADOS.email}`,
    tipo: 'digitar',
    alvo: 'campo',
    esperado: DADOS.email,
    teclado: 'email',
    rotuloCampo: 'E-mail da pessoa',
    rotuloBotao: f.rotuloAvancar,
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
    rotuloBotao: f.rotuloAvancar,
    tela: { titulo: 'Quanto você quer enviar?' },
    dicas: ['Digite só os números. Pode escrever 25 ou 25,00.', 'Escreva: 25'],
    erroGentil: 'Quase! O valor deste exercício é 25 reais. Escreva 25.',
    lembrete: 'Confira o valor e as vírgulas: 25,00 é vinte e cinco reais; 250,00 é dez vezes mais.',
  }

  const conta = passoEscolha(
    'conta',
    'Escolha de onde sai o dinheiro: Conta corrente.',
    { titulo: 'De qual conta?' },
    hash(`${semente}-conta`) % 2 === 0
      ? [{ id: 'corrente', rotulo: 'Conta corrente' }, { id: 'poupanca', rotulo: 'Poupança' }]
      : [{ id: 'poupanca', rotulo: 'Poupança' }, { id: 'corrente', rotulo: 'Conta corrente' }],
    'corrente',
    ['Escolha a conta que você usa no dia a dia para pagar.', 'Toque em "Conta corrente".'],
    'Quase! Neste exercício, escolha Conta corrente.',
    'Confira de qual conta o dinheiro vai sair antes de continuar.',
  )

  const data = passoEscolha(
    'data',
    'Escolha quando enviar: Hoje.',
    { titulo: 'Quando você quer enviar?' },
    [
      { id: 'hoje', rotulo: 'Hoje' },
      { id: 'agendar', rotulo: 'Agendar para outro dia' },
    ],
    'hoje',
    ['O Pix chega na hora quando é enviado hoje.', 'Toque em "Hoje".'],
    'Quase! Neste exercício, escolha Hoje.',
    'Pix enviado "hoje" chega na hora. "Agendar" só envia no dia marcado.',
  )

  // ---- conferência do nome (aqui mora a proteção contra golpe) ----
  const resumo = (comValor: boolean, comConta: boolean): Tela['resumo'] => [
    { rotulo: 'Para', valor: nomeNaTela },
    { rotulo: 'E-mail', valor: DADOS.email },
    ...(comValor ? [{ rotulo: 'Valor', valor: `R$ ${DADOS.valor}` }] : []),
    ...(comConta ? [{ rotulo: 'Conta', valor: 'Conta corrente' }] : []),
  ]

  const opcoesSimNao: Elemento[] = [
    { id: 'sim', rotulo: 'Sim, está certo' },
    { id: 'nao', rotulo: 'Não, está diferente' },
  ]

  // bancos com "confirmar destinatário" mostram o nome logo depois da chave; os outros, no fim
  const valorJaEscolhido = valorPrimeiro
  const revisar: Passo =
    variante === 'normal'
      ? passoEscolha(
          'revisar',
          `Confira: o nome é da ${DADOS.primeiroNome}${confirmaNoDestinatario && !valorJaEscolhido ? '' : ' e o valor é R$ ' + DADOS.valor}? Se sim, toque em "Sim, está certo".`,
          {
            titulo: confirmaNoDestinatario ? 'Confirme quem vai receber' : 'Confira antes de enviar',
            resumo: resumo(!confirmaNoDestinatario || valorJaEscolhido, !confirmaNoDestinatario && f.extras.includes('conta')),
          },
          opcoesSimNao,
          'sim',
          ['Leia o nome e o valor na tela. Eles batem com o que você queria?', 'Está tudo certo: toque em "Sim, está certo".'],
          'Leia de novo: o nome é da Ana. Está tudo certo.',
          'Antes de confirmar, leia o nome de quem vai receber e o valor. É a sua última chance de evitar um erro.',
        )
      : passoEscolha(
          'revisar',
          `Confira: o nome na tela é o da ${DADOS.primeiroNome}? Se for de outra pessoa, toque em "Não, está diferente".`,
          {
            titulo: confirmaNoDestinatario ? 'Confirme quem vai receber' : 'Confira antes de enviar',
            resumo: resumo(!confirmaNoDestinatario || valorJaEscolhido, false),
          },
          opcoesSimNao,
          'nao',
          [`Você quer pagar a ${DADOS.primeiroNome}. Que nome aparece na tela?`, `O nome na tela é ${DADOS.nomeEstranho}, e não ${DADOS.nome}. Toque em "Não, está diferente".`],
          `Atenção! O nome na tela não é o da ${DADOS.primeiroNome}. Se o nome estiver diferente, não envie.`,
          'Nome diferente do que você esperava? Não envie. Pare e confirme a chave com a pessoa, por outro meio, como ligar para ela.',
        )

  // ---- confirmar, senha e comprovante ----
  const resumoFinal = resumo(true, f.extras.includes('conta'))
  const botoesConfirmar: Elemento[] =
    hash(`${semente}-confirmar`) % 2 === 0
      ? [{ id: 'confirmar', rotulo: f.rotuloConfirmar }, { id: 'cancelar', rotulo: 'Cancelar' }]
      : [{ id: 'cancelar', rotulo: 'Cancelar' }, { id: 'confirmar', rotulo: f.rotuloConfirmar }]

  const confirmar = passoToque(
    'confirmar',
    `Tudo certo. Toque em ${f.rotuloConfirmar}.`,
    { titulo: 'Confirmar o Pix', resumo: resumoFinal },
    botoesConfirmar,
    'confirmar',
    f.rotuloConfirmar,
    `O botão "${f.rotuloConfirmar}" segue para o envio do dinheiro. Só toque nele depois de conferir nome e valor.`,
  )

  const cancelar = passoToque(
    'cancelar',
    'Toque em Cancelar. Depois, confirme a chave com a Ana, por outro meio.',
    { titulo: 'Confirmar o Pix', resumo: resumoFinal },
    botoesConfirmar,
    'cancelar',
    'Cancelar',
    'Cancelar é sempre permitido. Nada foi enviado. Confirme a chave com a pessoa antes de tentar de novo.',
  )

  const nomeSenha = f.confirmacao.nome === 'senha' ? `a sua senha de ${digitos} números` : 'a sua assinatura eletrônica'
  const passoSenha: Passo = {
    id: 'senha',
    instrucao: `Digite ${nomeSenha} do exercício: ${senha}.`,
    tipo: 'digitar',
    alvo: 'campo',
    esperado: senha,
    teclado: 'senha',
    rotuloBotao: 'Confirmar',
    tela: {
      titulo: f.confirmacao.nome === 'senha' ? `Digite a sua senha de ${digitos} números` : 'Digite a sua assinatura eletrônica',
      linhas: [`Senha só do exercício: ${senha}.`, 'No banco de verdade, ninguém pede a sua senha por telefone, mensagem ou e-mail.'],
    },
    dicas: [`Toque nos números ${senha.split('').join(', ')}, nesta ordem.`, 'Depois toque em Confirmar.'],
    erroGentil: `Quase! A senha do exercício é ${senha}. Use ⌫ para apagar e tente de novo.`,
    lembrete: 'A senha é só sua. Nunca diga a senha nem o código recebido por mensagem a ninguém, nem a quem diz ser do banco.',
  }

  const comprovante = passoToque(
    'comprovante',
    'O Pix foi enviado! Toque em Salvar comprovante.',
    {
      titulo: 'Pix enviado ✓',
      resumo: [
        { rotulo: 'Valor', valor: `R$ ${DADOS.valor}` },
        { rotulo: 'Para', valor: DADOS.nome },
      ],
    },
    misturar({ id: 'salvar', rotulo: 'Salvar comprovante' }, enganos('Compartilhar', 'Voltar ao início'), `${semente}-comprovante`),
    'salvar',
    'Salvar comprovante',
    'Guarde o comprovante: ele prova que você pagou e mostra para quem.',
  )

  // ---- monta na ordem do banco ----
  const antes = [entrar, saldo, irPix, ...caminho]
  const dados: Passo[] = valorPrimeiro ? [valor, tipoChave, chave] : [tipoChave, chave]
  const temConta = f.extras.includes('conta')
  if (confirmaNoDestinatario) dados.push(revisar)
  if (confirmaNoDestinatario && temConta) dados.push(conta) // Itaú e BB: a conta vem antes do valor
  if (!valorPrimeiro) dados.push(valor)
  if (!confirmaNoDestinatario && temConta) dados.push(conta) // Bradesco: valor e depois a conta
  if (f.extras.includes('data')) dados.push(data)
  if (!confirmaNoDestinatario) dados.push(revisar)

  if (variante === 'nome-diferente') {
    // o aluno para assim que vê o nome errado: nada depois disso aconteceria
    const corte = dados.indexOf(revisar)
    return [...antes, ...dados.slice(0, corte + 1), cancelar]
  }
  return [...antes, ...dados, confirmar, passoSenha, comprovante]
}
