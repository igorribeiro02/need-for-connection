# Teste de navegador do Santander (telas copiadas de capturas reais): fluxo completo, voltar e variante nome diferente.
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

    def toque(nome): page.get_by_role("button", name=nome, exact=True).click()
    def shot(nome): page.locator(".celular.banco").screenshot(path=f"{OUT}/{nome}.png")

    page.get_by_role("button", name="Mundo 4: Banco e Pix", exact=True).click()
    page.get_by_role("button", name="Fazer um Pix pela chave").click()
    page.get_by_role("button", name="Santander", exact=True).click()
    toque("Entrar")
    shot("sant-1-inicio")
    check("saldo escondido, olho na faixa", page.get_by_role("button", name="Mostrar saldo").is_visible())
    toque("Mostrar saldo")
    page.get_by_role("button", name="Pix e pagar", exact=True).first.click()
    shot("sant-2-pix")
    check("tela Pix e pagar tem a caixa da chave", page.get_by_label("Chave Pix, nome, cód de barras…").is_visible())
    # voltar um passo pela seta do app
    page.get_by_role("button", name="Voltar", exact=True).click()
    check("seta ← volta para o início", page.get_by_role("button", name="Mostrar saldo").count() + page.get_by_role("button", name="Esconder saldo").count() > 0)
    page.get_by_role("button", name="Pix e pagar", exact=True).first.click()
    page.get_by_label("Chave Pix, nome, cód de barras…").fill("ana@exemplo.com")
    toque("Continuar")
    shot("sant-3-valor")
    check("Definir transferência mostra o nome da Ana", page.get_by_text("Para Ana Beatriz Souza").is_visible())
    page.get_by_label("Valor em reais").fill("25")
    toque("Continuar")
    shot("sant-4-conta")
    page.get_by_role("button", name="Saldo em conta").click()
    shot("sant-5-revisao")
    check("Revisão pergunta o nome", page.get_by_text("Confirmar pagamento para Ana Beatriz Souza").is_visible())
    toque("Sim, está certo")
    shot("sant-6-confirmar")
    toque("Confirmar e transferir")
    check("depois de confirmar vem a senha", page.get_by_text("Digite a sua senha").first.is_visible())
    check("sem erros no console", not errors)
    if errors: log.append("  erros: " + " | ".join(errors[:3]))
    b.close()
