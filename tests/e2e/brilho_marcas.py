# Fase do brilho no celular de verdade (toque, não mouse): as quatro marcas, cada uma com o seu painel e o seu gesto.
# Requer: servidor em http://localhost:4173 (npm run build && npm run preview)
import re
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

W0 = ["w0-desbloquear", "w0-icones", "w0-deslizar", "w0-teclado", "w0-andar"]
perfil = {
    "versao": 1,
    "perfil": {"id": "p1", "nome": "Dona Maria", "avatar": "👵"},
    "preferencias": {"escalaFonte": 1, "altoContraste": False, "narracao": False, "modoMapa": "lista", "guiado": False},
    "fases": {f: {"status": "concluida", "estrelas": 3, "passosConcluidos": []} for f in W0},
    "cenasVistas": [f"{t}:{f}" for f in W0 for t in ("abertura", "fechamento")] + ["final:0"],
}

with sync_playwright() as p:
    for marca, em_pe, duas_vezes in [("samsung", False, False), ("iphone", True, False), ("motorola", False, True), ("xiaomi", True, False)]:
        ctx = p.chromium.launch().new_context(viewport={"width": 393, "height": 780}, device_scale_factor=2, has_touch=True, is_mobile=True)
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL)
        page.evaluate("""(d) => {
            localStorage.setItem('nfc:v1:perfis', JSON.stringify(['p1']));
            localStorage.setItem('nfc:v1:ativo', 'p1');
            localStorage.setItem('nfc:v1:perfil:p1', JSON.stringify(d));
        }""", perfil)
        page.reload()
        cdp = ctx.new_cdp_session(page)

        def arrastar(x0, y0, x1, y1, passos=8):
            cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
            for i in range(1, passos + 1):
                cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + (x1 - x0) * i / passos, "y": y0 + (y1 - y0) * i / passos}]})
            cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
            page.wait_for_timeout(300)

        def passo():
            return int(re.search(r"Passo (\d) de 4", page.locator("body").inner_text()).group(1))

        def centro(loc):
            b = loc.bounding_box()
            return b["x"] + b["width"] / 2, b["y"] + b["height"] / 2

        def barra(de, ate):
            r = page.locator(".cb-barra[role=slider]").bounding_box()
            pos = lambda f: (r["x"] + r["width"] / 2, r["y"] + r["height"] * (1 - f)) if em_pe else (r["x"] + r["width"] * f, r["y"] + r["height"] / 2)
            arrastar(*pos(de), *pos(ate))

        page.get_by_role("button", name=re.compile("Aumentar o brilho")).first.click()
        for _ in range(4):
            for b in ("Continuar", "Vamos lá!"):
                if page.get_by_role("button", name=b, exact=True).count():
                    page.get_by_role("button", name=b, exact=True).first.click()
                    page.wait_for_timeout(100)
        page.get_by_role("button", name=re.compile({"iphone": "iPhone", "samsung": "Samsung", "motorola": "Motorola", "xiaomi": "Xiaomi"}[marca]), exact=True).first.tap()
        page.wait_for_timeout(200)
        check(f"{marca}: marca escolhida na própria fase", page.get_by_role("button", name=re.compile({"iphone": "iPhone", "samsung": "Samsung", "motorola": "Motorola", "xiaomi": "Xiaomi"}[marca]), exact=True).first.get_attribute("aria-pressed") == "true")
        check(f"{marca}: começa no passo 1", passo() == 1)

        # toque curto não abre; deslizar para baixo abre
        x, y = centro(page.locator(".cb-bolinha"))
        page.touchscreen.tap(x, y)
        page.wait_for_timeout(200)
        check(f"{marca}: toque curto não abre o painel", passo() == 1)
        arrastar(x, y, x, y + 70)
        if duas_vezes:
            check(f"{marca}: 1º deslize só mostra os avisos", passo() == 1 and page.get_by_text("Deslize de novo").is_visible())
            x, y = centro(page.locator(".cb-bolinha"))
            arrastar(x, y, x, y + 70)
        check(f"{marca}: painel aberto (passo 2)", passo() == 2)
        r = page.locator(".cb-barra[role=slider]").bounding_box()
        check(f"{marca}: barra {'em pé' if em_pe else 'deitada'}", (r["height"] > r["width"]) == em_pe)

        barra(0.2, 0.5)
        check(f"{marca}: metade não conclui", passo() == 2)
        barra(0.5, 0.99)
        check(f"{marca}: brilho alto avança", passo() == 3)
        page.locator(".cb-aviso-cartao--botao").tap()
        page.wait_for_timeout(300)
        check(f"{marca}: tocar na mensagem avança", passo() == 4)
        barra(0.99, 0.3)
        page.wait_for_timeout(300)
        check(f"{marca}: baixar o brilho conclui a fase", page.get_by_text("Agora dá para ler").count() > 0 or page.get_by_role("heading", name="Você conseguiu!").count() > 0)
        check(f"{marca}: sem erros no console", not errors)
        page.screenshot(path=f"{OUT}/brilho-{marca}.png")
        ctx.close()

sys.exit(1 if any(l.startswith("FALHA") for l in log) else 0)
