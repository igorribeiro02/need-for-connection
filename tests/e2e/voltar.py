# Teste de navegador do "voltar": botão da fase, seta ← dentro dos apps, botão voltar do celular/navegador.
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
    def esperar_passo(n, total): page.get_by_text(f"Passo {n} de {total}").wait_for(timeout=3000)
    def mapa(): return page.get_by_text("Escolha um mundo para treinar").is_visible()
    def abrir_mundo4(): page.get_by_role("button", name="Mundo 4: Banco e Pix").click()

    # ---------- Bradesco: Voltar um passo, seta ← do app, botão voltar do celular ----------
    abrir_mundo4()
    page.get_by_role("button", name="Fazer um Pix pela chave").click()
    page.get_by_role("button", name="Bradesco", exact=True).click()
    check("no primeiro passo não há 'Voltar um passo'", page.get_by_role("button", name="← Voltar um passo").count() == 0)
    toque("Entrar")
    esperar_passo(2, 10)
    page.get_by_role("button", name="← Voltar um passo").click()
    esperar_passo(1, 10)
    check("'Voltar um passo' volta ao passo anterior", page.get_by_text("Voltamos um passo").is_visible())
    toque("Entrar"); esperar_passo(2, 10)
    toque("Mostrar saldo"); esperar_passo(3, 10)
    page.get_by_role("button", name="Voltar", exact=True).click()  # seta ← da tela inicial
    esperar_passo(2, 10)
    check("seta ← da tela inicial do banco volta um passo", True)
    toque("Mostrar saldo"); esperar_passo(3, 10)
    toque("Pix"); esperar_passo(4, 10)
    check("tela do Pix do Bradesco aberta", page.get_by_text("Como você quer transferir?").is_visible())
    page.get_by_role("button", name="Voltar", exact=True).click()
    esperar_passo(3, 10)
    check("seta ← da tela do Pix volta para a tela inicial", page.get_by_role("button", name="Pix", exact=True).is_visible())
    toque("Pix"); esperar_passo(4, 10)

    # botão voltar do celular/navegador: volta um passo, depois ao mapa
    page.go_back()
    esperar_passo(3, 10)
    check("voltar do celular volta um passo dentro da fase", not mapa())
    page.go_back(); esperar_passo(2, 10)
    page.go_back(); esperar_passo(1, 10)
    page.go_back()
    page.get_by_text("Escolha um mundo para treinar").wait_for(timeout=3000)
    check("no primeiro passo, voltar do celular leva ao mapa", mapa())

    # entrar de novo, avançar e usar 'Voltar ao mapa': o histórico não fica sujo
    abrir_mundo4()
    page.get_by_role("button", name="Fazer um Pix pela chave").click()
    toque("Entrar"); esperar_passo(2, 10)
    page.get_by_role("button", name="Voltar ao mapa").click()
    page.get_by_text("Escolha um mundo para treinar").wait_for(timeout=3000)
    page.go_back()
    page.wait_for_timeout(300)
    check("depois de 'Voltar ao mapa', voltar do celular não reabre a fase", not page.get_by_text("Passo 2 de 10").is_visible())
    page.goto(URL)
    page.wait_for_timeout(300)

    # ---------- Itaú: seta ← dentro das telas copiadas ----------
    abrir_mundo4()
    page.get_by_role("button", name="Fazer um Pix pela chave").click()
    page.get_by_role("button", name="Trocar de banco").click()
    page.get_by_role("button", name="Itaú", exact=True).click()
    toque("Entrar"); toque("Mostrar saldo")
    toque("Pix e transferir"); esperar_passo(4, 11)
    toque("Nova transferência  +") if page.get_by_role("button", name="Nova transferência  +", exact=True).count() else page.get_by_role("button", name="Nova transferência +").click()
    esperar_passo(5, 11)
    page.get_by_role("button", name="Voltar", exact=True).click()
    esperar_passo(4, 11)
    check("Itaú: seta ← da tela 'Para quem' volta para 'Pix e transferir'", page.get_by_text("Sugestões pra você").is_visible())
    page.screenshot(path=f"{OUT}/voltar-itau.png", full_page=True)

    # ---------- Inter: a seta ← não é 'erro' no passo de confirmar ----------
    page.get_by_role("button", name="Voltar ao mapa").click()
    abrir_mundo4()
    page.get_by_role("button", name="Fazer um Pix pela chave").click()
    page.get_by_role("button", name="Trocar de banco").click()
    page.get_by_role("button", name="Inter", exact=True).click()
    toque("Entrar"); toque("Mostrar saldo"); toque("Pix"); toque("Pagar")
    esperar_passo(5, 10)
    page.get_by_label("Chave").first.fill("ana@exemplo.com") if page.get_by_label("Chave").count() else None
    page.screenshot(path=f"{OUT}/voltar-inter.png", full_page=True)
    page.get_by_role("button", name="Voltar", exact=True).click()
    esperar_passo(4, 10)
    check("Inter: seta ← volta um passo", not page.get_by_text("Quase!").is_visible())

    # ---------- Uber: seta ← dentro do app de transporte ----------
    page.get_by_role("button", name="Voltar ao mapa").click()
    page.get_by_role("button", name="Mundo 7: Transporte por aplicativo").click()
    page.get_by_role("button", name="Pedir um Uber").click()
    toque("Para onde?"); esperar_passo(2, 5)
    page.get_by_role("button", name="Voltar", exact=True).click()
    esperar_passo(1, 5)
    check("Uber: seta ← volta ao início", page.get_by_role("button", name="Para onde?", exact=True).is_visible())
    check("sem erros no console", not errors)
    if errors: print(errors)
    b.close()
