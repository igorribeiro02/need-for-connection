# Teste de navegador do Mundo 7: pedir Uber, pedir 99 e conferir o motorista.
# Requer: servidor em http://localhost:4173 (npm run build && npm run preview)
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:4173/"
OUT = sys.argv[1] if len(sys.argv) > 1 else "."
log = []
import atexit
atexit.register(lambda: print("\n".join(log)))
def check(nome, cond):
    log.append(("OK  " if cond else "FALHA ") + nome)
    return cond

W0 = ["w0-tocar", "w0-deslizar", "w0-teclado", "w0-andar"]
perfil = {
    "versao": 1,
    "perfil": {"id": "p1", "nome": "Seu João", "avatar": "👴"},
    "preferencias": {"escalaFonte": 1, "altoContraste": False, "narracao": False, "modoMapa": "mapa", "guiado": False},
    "fases": {f: {"status": "concluida", "estrelas": 3, "passosConcluidos": []} for f in W0},
}

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.goto(URL)
    page.evaluate("""(d) => {
        localStorage.setItem('nfc:v1:perfis', JSON.stringify(['p1']));
        localStorage.setItem('nfc:v1:ativo', 'p1');
        localStorage.setItem('nfc:v1:perfil:p1', JSON.stringify(d));
    }""", perfil)
    page.reload()

    def passo(n, total): return page.get_by_text(f"Passo {n} de {total}").is_visible()
    def toque(nome): page.get_by_role("button", name=nome, exact=True).click()
    def shot(nome): page.locator(".celular.banco").screenshot(path=f"{OUT}/{nome}.png")
    def abrir_mundo():
        page.get_by_role("button", name="Mundo 7: Transporte por aplicativo").click()

    # ---------------- Uber ----------------
    abrir_mundo()
    for n in ["Pedir um Uber", "Pedir um carro na 99", "Conferir o motorista antes de entrar"]:
        page.get_by_role("button", name=n).wait_for()
    check("Mundo 7 abre e lista as 3 fases", True)
    page.get_by_role("button", name="Pedir um Uber").click()
    check("Uber tem 5 passos", passo(1, 5))
    check("faixa diz que é simulação do Uber", page.get_by_text("Simulação no estilo do app: Uber").is_visible())
    shot("uber-1-inicio")
    page.get_by_role("button", name="Casa").click()
    check("lugar recente avisa com calma", page.get_by_role("status").get_by_text("não funciona neste exercício").is_visible())
    toque("Para onde?")
    check("passo 2: escrever o destino", passo(2, 5))
    shot("uber-2-destino")
    page.get_by_label("Para onde?").fill("Mercado Central")
    page.get_by_role("button", name="Buscar").click()
    check("passo 3: escolher o carro", passo(3, 5))
    shot("uber-3-categorias")
    page.get_by_role("button", name="Comfort").click()
    check("carro errado dá erro gentil e não avança", passo(3, 5) and page.get_by_text("Quase!").first.is_visible())
    page.get_by_role("button", name="UberX").click()
    check("passo 4: confirmar o UberX", passo(4, 5))
    shot("uber-4-confirmar")
    page.get_by_role("button", name="Confirmar UberX").click()
    check("passo 5: confirmar o local de partida", passo(5, 5))
    shot("uber-5-partida")
    page.get_by_role("button", name="Confirmar", exact=True).click()
    check("Uber conclui a fase", page.get_by_text("Fase concluída!").is_visible())
    page.get_by_role("button", name="Voltar ao mapa").click()

    # ---------------- 99 ----------------
    abrir_mundo()
    page.get_by_role("button", name="Pedir um carro na 99").click()
    check("99 tem 5 passos", passo(1, 5))
    shot("99-1-inicio")
    toque("Para onde vamos?")
    page.get_by_label("Para onde vamos?").fill("Mercado Central")
    page.get_by_role("button", name="Buscar").click()
    shot("99-3-categorias")
    page.get_by_role("button", name="Pop").click()
    shot("99-4-confirmar")
    page.get_by_role("button", name="Confirmar", exact=True).click()
    shot("99-5-partida")
    page.get_by_role("button", name="Tudo certo, pode chamar!").click()
    check("99 conclui a fase", page.get_by_text("Fase concluída!").is_visible())
    page.get_by_role("button", name="Voltar ao mapa").click()

    # ---------------- Conferir o motorista ----------------
    abrir_mundo()
    page.get_by_role("button", name="Conferir o motorista antes de entrar").click()
    check("conferência tem 4 passos", passo(1, 4))
    shot("conf-1-placa-errada")
    check("pergunta do exercício fica fora do desenho do app", page.get_by_text("Pergunta do exercício (não faz parte do app)").is_visible())
    page.get_by_role("button", name="Sim, é o meu carro").click()
    check("dizer 'sim' para a placa errada alerta", page.get_by_text("A placa do carro é diferente").is_visible() and passo(1, 4))
    page.get_by_role("button", name="Não, é diferente").click()
    page.get_by_role("button", name="Sim, é o meu carro").click()
    check("passo 3: o nome", passo(3, 4))
    page.get_by_role("button", name="Esperar o motorista perguntar o meu nome").click()
    check("passo 4: o código aparece na tela", passo(4, 4) and page.get_by_text("Código da viagem: 4821").is_visible())
    shot("conf-4-codigo")
    page.get_by_role("button", name="Para o motorista, antes de entrar no carro").click()
    check("conferência conclui a fase", page.get_by_text("Fase concluída!").is_visible())

    # letra 200% e alto contraste na tela do app: sem rolagem lateral
    page.get_by_role("button", name="Voltar ao mapa").click()
    abrir_mundo()
    page.get_by_role("button", name="Pedir um carro na 99").click()
    page.get_by_role("button", name="Alto contraste: desligado").click()
    for _ in range(4): page.get_by_role("button", name="Aumentar letra").click()
    shot("99-200")
    check("sem rolagem horizontal com letra 200% (99)", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))
    check("sem erros no console", not errors)
    if errors: print(errors)
    b.close()
