// Contratos do jogo: o grupo todo escreve fases usando estes tipos.
// Regra: este arquivo não importa React nem nada de fora de core/.

import type { MapaDef } from '../world/grid'

export type TipoPasso =
  | 'tocar' // tocar em um elemento da tela simulada (resposta = id do alvo)
  | 'digitar' // digitar um texto
  | 'escolher' // escolher uma opção
  | 'arrastar' // arrastar um elemento até um destino
  | 'deslizar' // deslizar uma lista até uma ponta (resposta = "inicio" ou "fim")
  | 'andar' // levar o personagem até um objeto do mapa
  | 'julgar' // decidir "golpe" ou "seguro"

export type Passo = {
  id: string // ex.: "menu-pix"
  instrucao: string // frase curta: "Toque em Pix"
  tipo: TipoPasso
  alvo: string // elemento da tela simulada
  /** Botões da tela básica (usada nas fases simples). Os simuladores de banco etc. ignoram. */
  elementos?: {
    id: string
    rotulo: string
    icone?: string
    /** Tela inicial do banco: onde o botão aparece (pílula de saldo, grade de atalhos ou lista de serviços). */
    grupo?: 'saldo' | 'atalho' | 'servico'
    detalhe?: string // segunda linha, nos itens da lista de serviços
    discreto?: boolean // botão pequeno e sem destaque (ex.: o "X" de um pop-up)
  }[]
  /** Celular simples: cartão desenhado acima dos botões (ajustes, pop-up, mensagem). */
  painel?: PainelCelular
  esperado?: string | string[] // resposta certa (digitar, escolher, julgar)
  dicas: string[] // 1ª discreta, 2ª mostra onde tocar
  erroGentil: string // ex.: "Quase! Procure o botão verde"
  lembrete: string // texto que aparece no Modo Lembrar
  /** 'deslizar': de que ponta a lista começa (padrão: topo). */
  posicaoInicial?: 'topo' | 'fim'
  /** 'digitar': texto que já vem escrito na caixa (para treinar a apagar). */
  valorInicial?: string
  /** 'digitar': aceita qualquer texto (não vazio); `esperado` vira só uma sugestão. */
  livre?: boolean
  /** 'digitar': compara só os números (CPF com ou sem pontos e traço, telefone com ou sem parênteses). */
  soDigitos?: boolean
  /** 'digitar': tipo de teclado que o celular abre. */
  teclado?: 'texto' | 'numero' | 'email' | 'valor' | 'senha'
  /** 'digitar': nome do campo e do botão de enviar. */
  rotuloCampo?: string
  rotuloBotao?: string
  /** Simulador de banco: como a tela aparece neste passo (os botões vêm de `elementos`). */
  tela?: {
    titulo: string
    linhas?: string[]
    saldo?: string // cartão de saldo (use "••••••" para saldo escondido)
    resumo?: { rotulo: string; valor: string }[] // conferência: "Para", "Valor"...
    layout?: 'grade' | 'lista' | 'inicio' | 'menu-pix' | 'app' // 'inicio' = tela inicial do app; 'menu-pix' = tela do Pix; 'app' = tela feita de blocos
    inicio?: { secaoAtalhos: string; secaoServicos?: string; colunas: number }
    menuPix?: MenuPix
    app?: TelaApp
  }
  /** Passo 'escolher' de uma tela de app: as opções ficam num painel do exercício, fora do desenho do app. */
  painelExercicio?: boolean
  /** 'andar': verbo do botão de confirmar, ex.: "Pegar" (padrão: "Escolher"). */
  acao?: string
}

/** Cartão que o celular simples mostra no passo: título, linhas de texto e um medidor (volume, brilho). */
export type PainelCelular = {
  titulo?: string
  linhas?: string[]
  medidor?: { rotulo: string; nivel: number; max: number }
  /** 'escuro' = tela difícil de ler; 'popup' = janela que aparece sozinha; 'mensagem' = balão de conversa. */
  estilo?: 'normal' | 'escuro' | 'popup' | 'mensagem'
}

// ---------- História (camada de narrativa por cima das fases) ----------

export type PersonagemId = 'neuza' | 'ana' | 'osvaldo' | 'sorrateiro' | 'carlos'

/** Um balão de fala. O texto aceita {nome} (primeiro nome de quem joga). */
export type Fala = { quem: PersonagemId; texto: string }

/** O que se ganha ao terminar uma fase (ou um mundo): vira uma página do álbum. */
export type Premio = { emoji: string; titulo: string }

/** Mini-história de uma fase: cena antes do exercício e cena depois. O exercício em si não muda. */
export type Historia = {
  abertura: Fala[] // 1 a 3 balões; o último pede a ação do exercício
  fechamento: Fala[] // reação ao que a pessoa fez
  premio: Premio
}

/** Cena que fecha um mundo (aparece depois de terminar a última fase dele). */
export type HistoriaMundo = { falas: Fala[]; premio: Premio }

export type Simulador = 'banco' | 'mensagens' | 'arquivos' | 'celular' | 'transporte'

export type Fase = {
  id: string // ex.: "w4-pix-chave"
  mundo: number
  titulo: string
  simulador: Simulador
  precisaEscolherBanco?: boolean
  /** Simulador 'transporte': de qual aplicativo (Uber, 99) são as telas. */
  aplicativo?: AppTransporte
  /** Mapa usado pelos passos 'andar' desta fase. */
  mapa?: MapaDef
  /** Situação em uma frase, mostrada acima do exercício. Fases com `historia` mostram a fala da abertura no lugar. */
  cenario?: string
  historia?: Historia
  /** Fases de banco: os passos mudam conforme o banco escolhido (menus e nomes diferentes). */
  gerarPassos?: (banco: BancoConfig) => Passo[]
  /** Mostra o desenho de como fazer a tarefa, com as mãos, em um celular de verdade (por marca). */
  guiaReal?: 'volume' | 'brilho' | 'print'
  passos: Passo[]
}

export type Mundo = {
  numero: number
  titulo: string
  descricao: string
  fases: Fase[]
  obrigatorio?: boolean
  /** Dia da semana da história, mostrado no mapa. */
  dia?: string
  historiaFinal?: HistoriaMundo
}

/** Como o Pix por chave funciona em um banco. Cada banco tem o seu fluxo (ordem das telas e nomes dos botões). */
export type FluxoPix = {
  entradaPix: string // atalho na tela inicial: "Pix", "Área Pix"
  /** Botões entre o Pix e a escolha da chave. Vazio quando `menuPix` existe (a chave é digitada na própria tela do Pix). */
  caminho: { rotulo: string; dica?: string }[]
  /** Bancos cuja tela do Pix já tem o campo da chave (sem escolher o tipo da chave antes). */
  menuPix?: MenuPix
  ordem: 'chave-primeiro' | 'valor-primeiro'
  rotuloAvancar: string // botão depois de digitar: "Continuar", "Avançar"
  /** Telas a mais que alguns bancos têm. */
  extras: ('confirmar-destinatario' | 'conta' | 'data')[]
  rotuloConfirmar: string // botão que envia o Pix
  /** A escolha da conta vem depois do valor (Itaú). Padrão: antes, nos bancos com conferência do destinatário. */
  contaDepoisDoValor?: boolean
  /** 'confirmação no app' = só tocar em Confirmar (sem digitar senha), como o iSafe do Inter. */
  confirmacao: { nome: 'senha' | 'assinatura eletrônica' | 'confirmação no app'; digitos: number }
}

// ---------- Telas de app montadas por blocos (copiadas da estrutura de capturas reais) ----------
// Textos podem ter {nome} (primeiro nome de quem joga), {iniciais} e {hoje} (data), trocados na hora de desenhar.

/** Um botão ou ícone da tela. Sem `id`, o id é o rótulo em minúsculas. `inerte` = só enfeite, nunca vale como resposta. */
export type ItemApp = {
  rotulo: string
  icone?: string
  id?: string
  detalhe?: string
  etiqueta?: string // selinho: "Novo", "Até 24x"
  principal?: boolean // botão cheio, na cor do banco
  inerte?: boolean
  anel?: boolean // desenha um círculo bem visível em volta do botão (para botões pequenos, como o olho do saldo)
  segurar?: boolean // só vale se a pessoa SEGURAR o dedo (ex.: microfone para gravar áudio) e soltar depois
}

export type ZapMensagem = {
  de: 'eu' | 'outro'
  autor?: string // nome de quem falou, em conversa de grupo
  texto?: string
  hora: string
  audio?: string // duração, ex.: '0:04'
  foto?: string // emoji da foto enviada
  estado?: 'enviada' | 'entregue' | 'lida'
  dia?: string // separador de dia antes da mensagem
  documento?: { nome: string; info: string } // arquivo enviado (cartão com ícone de PDF)
}

export type ZapConversa = { id: string; nome: string; avatar: string; previa: string; hora: string; naoLidas?: number; ticks?: 'entregue' | 'lida'; fixa?: boolean }

export type BlocoApp =
  | { tipo: 'barra'; titulo?: string; voltar?: boolean | ItemApp; acoes?: ItemApp[]; grande?: 'linha' | 'abaixo'; sobretitulo?: string } // seta, título (centro, ou grande à esquerda/abaixo), linha pequena acima do título e botões redondos
  | { tipo: 'busca'; texto: string }
  | { tipo: 'pesquisa'; item: ItemApp } // barra de pesquisa que funciona como botão ("Para onde?")
  | { tipo: 'faixa'; avatar?: string; saudacao?: string; acoes?: ItemApp[]; busca?: string; contas?: ItemApp[] } // faixa colorida do alto da tela inicial
  | { tipo: 'abas'; itens: string[]; ativa: number }
  | { tipo: 'saldo'; rotulo: string; valor: string; olho?: ItemApp; apoio?: string; botao?: ItemApp; extrato?: string; linha?: boolean }
  | { tipo: 'fichas'; itens: ItemApp[]; ativa?: number }
  | { tipo: 'atalhos'; titulo?: string; itens: ItemApp[]; estilo: 'quadrados' | 'redondos' | 'caixas' }
  | { tipo: 'lista'; titulo?: string; acao?: ItemApp; itens: ItemApp[]; estilo?: 'linhas' | 'caixas' }
  | { tipo: 'promo'; titulo: string; texto?: string; botao?: ItemApp; escura?: boolean }
  | { tipo: 'titulo'; texto: string; acao?: ItemApp; apoio?: string }
  | { tipo: 'campo'; icone?: string; valor?: boolean | 'esquerda'; entre?: string[] } // onde se digita (passo 'digitar'); valor = número grande; entre = linhas entre a caixa e o botão
  | { tipo: 'dados'; titulo?: string; linhas: { rotulo: string; valor: string }[] }
  | { tipo: 'destaque'; valor: string; nome?: string; chip?: ItemApp }
  | { tipo: 'cartao'; titulo: string; texto?: string; link?: string }
  | { tipo: 'botao'; item: ItemApp }
  | { tipo: 'folha'; texto: string; botao: ItemApp }
  | { tipo: 'navegacao'; itens: ItemApp[]; ativo: number; central?: number; ativoCheio?: boolean }
  | { tipo: 'janela'; titulo: string; texto?: string; fechar?: ItemApp; lado?: 'direita' | 'esquerda'; botoes: ItemApp[]; perigo?: boolean } // janela que aparece sozinha (pop-up): X pequeno no canto e botões grandes de enganar
  | { tipo: 'zapTopo'; titulo?: string; voltar?: ItemApp; avatar?: string; subtitulo?: string; acoes?: ItemApp[] } // barra verde do WhatsApp (lista ou conversa)
  | { tipo: 'zapConversas'; filtros?: string[]; itens: ZapConversa[]; novo?: ItemApp } // lista de conversas
  | { tipo: 'zapChat'; mensagens: ZapMensagem[]; campo?: ItemApp; anexar?: ItemApp; camera?: ItemApp; microfone?: ItemApp; enviar?: ItemApp; escrevendo?: boolean; texto?: string; aviso?: { texto: string; acoes?: ItemApp[] } } // conversa com balões e barra de mensagem; `aviso` = faixa de contato desconhecido
  | { tipo: 'zapMenu'; itens: ItemApp[] } // menu que abre nos três pontinhos
  | { tipo: 'zapDocumentos'; titulo?: string; itens: ItemApp[] } // escolher um documento do celular (nome em `rotulo`, data e tamanho em `detalhe`)
  | { tipo: 'zapDialogo'; titulo: string; texto?: string; marcado?: string; documento?: string; botoes: ItemApp[] } // caixa de pergunta do WhatsApp
  | { tipo: 'zapAnexos'; itens: ItemApp[] } // folha de anexos: documento, câmera, galeria...
  | { tipo: 'celularBrilho'; etapa: 'puxar' | 'ajustar' | 'ler'; valor: number; item: ItemApp; minimo?: number; maximo?: number } // desenho de um celular em que a pessoa desliza a barra de cima e arrasta o brilho; `item` é o que vale como resposta
  | { tipo: 'endereco'; texto: string; seguro?: boolean } // barra de endereço do navegador, com cadeado
  | { tipo: 'espaco' } // empurra o que vem depois para baixo (botão no pé da tela)
  | { tipo: 'texto'; texto: string; centro?: boolean; link?: boolean }

export type TelaApp = {
  escuro?: boolean
  escurecida?: boolean // fundo apagado atrás de uma folha (confirmação)
  zap?: boolean // tela do WhatsApp: sem margens, de ponta a ponta
  blocos: BlocoApp[]
}

/** Dados que mudam as telas (a variante "nome diferente" troca o nome de quem recebe). */
export type ContextoTela = { saldoVisivel: boolean; nomeDestino: string; chave: string; tipoChave: string; valor: string; saldo: string }

/** Telas próprias de um banco, copiadas de capturas reais. O que não estiver aqui usa a tela genérica. */
export type TelasBanco = {
  rotuloCampoChave: string // nome da caixa onde se digita a chave
  /** Onde está cada botão do exercício, em palavras (para quem não acha). */
  dicas: { saldo: string; pix: string; caminho?: string[]; conta?: string; confirmar?: string; cancelar?: string; autenticar?: string }
  inicio: (c: ContextoTela) => TelaApp // deve ter o item 'ver-saldo' (quando escondido) e 'pix'
  caminho?: ((c: ContextoTela) => TelaApp)[] // uma tela por botão do caminho; o alvo tem id `caminho-N`
  chave: (c: ContextoTela) => TelaApp
  valor?: (c: ContextoTela) => TelaApp // se o banco mostra o nome de quem recebe aqui, também serve de conferência (passo 'revisar')
  conta?: (c: ContextoTela) => TelaApp // escolher de qual conta sai o dinheiro; o alvo tem id `corrente`
  rotuloConta?: string // nome do botão da conta, ex.: "Conta Itaú"
  revisao?: (c: ContextoTela, modo: 'perguntar' | 'pagar') => TelaApp // 'pagar' tem os itens `confirmar` e `cancelar`
  autenticar?: (c: ContextoTela) => TelaApp // item `autenticar`
}

/** Aplicativo de transporte simulado (Uber, 99). As telas são blocos, como nos bancos. */
export type AppTransporte = {
  id: string // "uber"
  nome: string // "Uber"
  tema: BancoConfig['tema']
  /** De onde veio o desenho das telas (para o grupo conferir no app real). */
  fonte: string
}

/** Tela do Pix de um banco: campo da chave no alto, botões de apoio e atalhos de outros serviços. Só o campo funciona no exercício. */
export type MenuPix = {
  titulo: string // "Como você quer transferir?"
  rotuloCampo: string // "Digitar ou colar nome/chave"
  dicaCampo?: string // texto pequeno abaixo do campo
  botoes: { rotulo: string; icone: string }[] // ao lado do campo
  secaoMais?: string // "Mais opções"
  mais?: { rotulo: string; icone: string }[]
  secaoOutros?: string // "Outros Serviços"
  outros?: { rotulo: string; icone: string }[]
}

/** Como é a tela inicial do aplicativo: grade de atalhos e, às vezes, uma lista de serviços. */
export type InicioBanco = {
  secaoAtalhos: string // "Movimente sua conta"
  secaoServicos?: string // "Serviços e Produtos"
  colunas: number // atalhos por fileira
  atalhos: { rotulo: string; icone: string }[] // deve conter o atalho do Pix (fluxo.entradaPix)
  servicos?: { rotulo: string; detalhe: string; icone: string }[]
}

/** Configuração de um banco simulado (ver seção "Simulador de bancos e Pix"). */
export type BancoConfig = {
  id: string // "nubank"
  nomeNaLista: string // o que a pessoa vê ao escolher
  fluxo: FluxoPix
  inicio: InicioBanco
  /** Telas copiadas de capturas reais (Inter, PicPay, Mercado Pago...). Quando existe, substitui a tela inicial genérica. */
  telas?: TelasBanco
  tema: {
    corPrincipal: string
    corDestaque: string
    /** App escuro (ex.: Inter): fundo e cartões escuros. */
    escuro?: boolean
    /** Faixa do alto da tela inicial, quando difere da cor principal (ex.: Mercado Pago, amarelo com texto escuro). */
    faixa?: { fundo: string; texto: string }
    /** Cor de links e setas sobre fundo escuro. */
    link?: string
  }
  fonte: string // de onde veio o fluxo (para o grupo conferir no app real)
}
