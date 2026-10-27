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
| `src/simulators/` | Telas simuladas usadas pelas fases (hoje: celular; depois banco, mensagens). |
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
