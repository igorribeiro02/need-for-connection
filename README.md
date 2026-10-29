# Need for Connection

Jogo web (React + TypeScript + Vite) para ensinar tarefas digitais do dia a dia a pessoas mais velhas.
Sem servidor: perfil e progresso ficam salvos no navegador. A arquitetura completa está no documento do grupo.

## Como rodar

```bash
npm install
npm run dev        # abre em http://localhost:5173
npm test           # testes unitários (Vitest)
npm run build      # checa os tipos e gera a pasta dist/
```

## Onde fica cada coisa

| Pasta | O que tem |
| --- | --- |
| `src/core/engine/` | Contratos (`Passo`, `Fase`, `BancoConfig`) e o motor de fases. Sem React. |
| `src/core/world/` | Grade do mapa (andar, caminho) e regra de quais mundos estão abertos. Sem React. |
| `src/core/progress/` | Formato salvo, armazenamento, código de backup, PIN. Sem React. |
| `src/content/` | As fases, escritas em dados. |
| `src/app/` | Telas e navegação. |
| `src/world/` | Mapa com personagem: grade, botões direcionais e movimento (setas, toque). |
| `src/simulators/` | Telas simuladas usadas pelas fases: `celular/` e `banco/` (depois mensagens). |
| `src/content/banks.ts` | Os bancos da lista (cor, caminho até o Pix, nomes dos botões). |
| `src/content/banco/montarPix.ts` | Gera os passos do Pix para o banco escolhido. |
| `src/features/` | Cadastro local, backup, ajustes (letra, contraste, narração). |
| `src/styles/tokens.css` | Tamanhos e cores de acessibilidade. Mexa aqui, não nos componentes. |

## Como criar uma fase

1. Copie `src/content/phases/w0-tocar.ts` e troque `id`, `titulo` e os `passos`.
2. Coloque a fase na lista `fases` do mundo certo em `src/content/worlds.ts`.
   Tipos de passo prontos: `tocar`, `digitar`, `deslizar` e `andar` (este precisa de `mapa` na fase; veja `w0-andar.ts`).
   O teste `tests/content.test.ts` confere sozinho se a fase nova segue o contrato.
3. Pronto: ela aparece no mapa, salva o progresso e entra no resumo "Para lembrar depois".

Regras: frases curtas, `erroGentil` sempre acolhedor, pelo menos uma dica por passo, nenhum cronômetro.

## Publicar

O arquivo `.github/workflows/deploy.yml` publica no GitHub Pages a cada push na branch `main`
(em Settings > Pages, escolha "GitHub Actions" como fonte).

## Teste de navegador

`tests/e2e/fluxo_basico.py` percorre cadastro, fase, retomada, backup e PIN com Playwright (Python).
`tests/e2e/mapa_mundo0.py` percorre o mapa com personagem e as quatro fases do Mundo 0 (precisa do site rodando em `localhost:4173`: `npm run build && npm run preview`).
Rode `npm run build`, depois `npx vite preview --port 4173` em outro terminal, e então o script.

## O que falta (ver plano no documento)

Mapa com personagem, simuladores (celular, mensagens, banco), Modo Lembrar completo, mundos 1 a 6.


## Banco e Pix (etapa 4)

- Fases de banco têm `precisaEscolherBanco: true` e `gerarPassos(banco)`. O jogo pergunta o banco e gera os passos
  a partir do **fluxo daquele banco** (`fluxo` em `src/content/banks.ts`): nome do atalho do Pix, botões do caminho,
  ordem chave/valor, telas extras (confirmar destinatário, conta, data) e tipo de senha (4 ou 6 números, assinatura eletrônica).
- **De onde vêm os fluxos:** tutoriais de sites de tecnologia e finanças (2020 a 2024), citados no campo `fonte` de cada banco.
  Não são os aplicativos de hoje. **Antes de testar com idosos, abram o app de verdade e conferam** nomes, ordem e confirmações.
  Onde a fonte não dizia (por exemplo, a senha de alguns bancos), usamos o padrão e deixamos isso escrito na `fonte`.
- **Visual:** o simulador reproduz a estrutura de um app de banco (barra na cor do banco, cartão de saldo, atalhos em grade,
  listas com seta, conferência em linhas). Não usa logos, fontes nem cópias de tela dos bancos. Para chegar mais perto do app real,
  mandem capturas de tela do celular de vocês (sem dados pessoais) e ajustem cores e ordem dos ícones.
- Dados do exercício (Ana, ana@exemplo.com, R$ 25,00, senha 1234 ou 123456) são inventados e ficam em `montarPix.ts`.

## Ajuda que se adapta

- 2 erros seguidos no mesmo passo: aparece "Me mostre onde tocar" (conta como 1 dica).
- 3 erros seguidos: o jogo mostra sozinho onde tocar (sem tirar estrelas: errar nunca pune).
- Modo guiado (botão na fase): mostra sempre onde tocar; a fase termina com no máximo 1 estrela.
- Dicas dizem a posição do botão ("é o segundo da lista"); a última dica sempre destaca o alvo.
