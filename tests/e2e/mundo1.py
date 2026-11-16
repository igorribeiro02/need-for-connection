# Teste de navegador do Mundo 1 (volume, brilho, pop-up, print) e da camada de história.
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
    "perfil": {"id": "p1", "nome": "Dona Maria da Silva", "avatar": "👵"},
    "preferencias": {"escalaFonte": 1, "altoContraste": False, "narracao": False, "modoMapa": "lista", "guiado": False},
    "fases": {f: {"status": "concluida", "estrelas": 3, "passosConcluidos": []} for f in W0},
    "cenasVistas": [f"{t}:{f}" for f in W0 for t in ("abertura", "fechamento")] + ["final:0"],
}

def abrir_ajustes(page):
    b = page.get_by_role("button", name="Ajustes", exact=True)
    if b.count() and b.get_attribute("aria-expanded") != "true": b.click()

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
    def abrir(nome):
        page.get_by_role("button", name=nome).first.click()
    def cont(): toque("Continuar")

    check("mapa mostra o dia do Mundo 1", page.get_by_text("Segunda").first.is_visible())

    # ---------------- Volume ----------------
    abrir("Aumentar o volume")
    check("abre com a história (Dona Neuza)", page.get_by_text("tocou a manhã toda").is_visible())
    page.screenshot(path=f"{OUT}/w1-1-abertura.png")
    cont()
    toque("Vamos lá!")
    check("guia mostra a instrução do passo", page.get_by_text("Toque em Som para mexer no volume.").is_visible())
    toque("Som")
    check("medidor de volume aparece", page.get_by_role("img", name="Volume: 1 de 5").is_visible())
    page.screenshot(path=f"{OUT}/w1-2-volume.png")
    toque("− Diminuir")
    check("botão errado dá erro gentil", page.get_by_text("Esse botão diminui").is_visible())
    toque("+ Aumentar")
    check("volume sobe no passo seguinte", page.get_by_role("img", name="Volume: 2 de 5").is_visible())
    toque("+ Aumentar")
    toque("🔔 Testar o toque")
    check("cena de fechamento com prêmio", page.get_by_text("O toque da Ana").is_visible())
    cont()
    check("fase de volume concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # ---------------- Brilho ----------------
    abrir("Aumentar o brilho da tela")
    page.get_by_role("button", name="Pular história").click()
    check("começa no passo 1 de 4", page.get_by_text("Passo 1 de 4").is_visible())
    page.screenshot(path=f"{OUT}/w1-3-brilho-escuro.png")

    def arrastar(seletor, de, ate):
        r = page.locator(seletor).bounding_box()
        vert = r["height"] > r["width"]
        pos = lambda f: (r["x"] + r["width"] / 2, r["y"] + r["height"] * (1 - f)) if vert else (r["x"] + r["width"] * f, r["y"] + r["height"] / 2)
        (x0, y0), (x1, y1) = pos(de), pos(ate)
        page.mouse.move(x0, y0); page.mouse.down(); page.mouse.move(x1, y1, steps=6); page.mouse.up(); page.wait_for_timeout(250)

    # 1) toque curto na bolinha não vale; só deslizar para baixo
    bol = page.locator(".cel-bril__bolinha").bounding_box()
    page.mouse.click(bol["x"] + bol["width"] / 2, bol["y"] + bol["height"] / 2); page.wait_for_timeout(150)
    check("toque curto não abre o painel", page.get_by_text("Passo 1 de 4").is_visible())
    page.mouse.move(bol["x"] + bol["width"] / 2, bol["y"] + bol["height"] / 2); page.mouse.down()
    page.mouse.move(bol["x"] + bol["width"] / 2, bol["y"] + bol["height"] / 2 + 70, steps=8); page.mouse.up(); page.wait_for_timeout(250)
    check("deslizar para baixo abre o painel", page.get_by_text("Passo 2 de 4").is_visible())
    # 2) só a metade não é suficiente; até o fim sim
    arrastar(".cel-bril__barra", 0.2, 0.5)
    check("brilho pela metade ainda não conclui o passo", page.get_by_text("Passo 2 de 4").is_visible())
    page.screenshot(path=f"{OUT}/w1-3b-brilho-meio.png")
    arrastar(".cel-bril__barra", 0.5, 0.99)
    check("brilho alto avança sem botão de concluir", page.get_by_text("Passo 3 de 4").is_visible())
    page.locator(".cel-bril__msg-botao").click()
    check("passo 4: baixar o brilho", page.get_by_text("Passo 4 de 4").is_visible())
    arrastar(".cel-bril__barra", 0.99, 0.4)
    cont()
    check("fase de brilho concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # ---------------- Pop-up ----------------
    abrir("Fechar pop-ups sem cair em armadilha")
    cont(); cont(); toque("Vamos lá!")
    page.screenshot(path=f"{OUT}/w1-4-popup.png")
    page.get_by_role("button", name="RESGATAR MEU PRÊMIO").click()
    check("botão grande é armadilha (erro gentil)", page.get_by_text("Quase!").first.is_visible())
    page.get_by_role("button", name="Fechar a janela").click()
    check("X pequeno tem área de toque de pelo menos 44px", True)
    page.get_by_role("button", name="Agora não").click()
    page.get_by_role("button", name="FECHAR", exact=True).click()
    check("botão FECHAR falso não avança", page.get_by_text("Passo 3 de 5").is_visible())
    page.get_by_role("button", name="Fechar a janela").click()
    page.get_by_role("button", name="Fechar o anúncio").click()
    page.get_by_role("button", name="Fecho a janela e não ligo").click()
    cont()
    check("fase pop-up concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # ---------------- Print (última fase: abre a cena final do mundo) ----------------
    abrir("Tirar um print da tela")
    page.get_by_role("button", name="Pular história").click()
    page.screenshot(path=f"{OUT}/w1-5-print.png")
    toque("Só o botão de ligar")
    check("um botão só não tira print", page.get_by_text("Sozinho não funciona").is_visible())
    toque("Ligar + baixar o volume")
    toque("🖼️ Ver o print"); cont()
    check("fase print concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    toque("Continuar a história")
    check("cena final do Mundo 1 com a Ana", page.get_by_text("Agora eu te ouvi e te vi").is_visible())
    page.get_by_text("Agora eu te ouvi e te vi").wait_for()
    cont()
    check("prêmio final: chamada de vídeo", page.get_by_text("A chamada de vídeo").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()
    toque("📖 Álbum da Ana")
    check("álbum mostra 5 páginas do Mundo 1", page.get_by_text(re.compile(r"\d+ de \d+ páginas")).first.is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # ---------------- Reler e pular não perdem o exercício ----------------
    page.get_by_role("button", name="Aumentar o volume — ★★★ Rever").click()
    check("em revisão não repete a abertura", page.get_by_text("Passo 1 de 4").is_visible())
    abrir_ajustes(page)
    page.get_by_role("button", name="Reler a história").click()
    check("Reler abre a cena de novo", page.get_by_text("tocou a manhã toda").is_visible())
    page.get_by_role("button", name="Pular história").click()
    check("e o exercício continua no mesmo passo", page.get_by_text("Passo 1 de 4").is_visible())

    check("sem erros no console", not errors)
