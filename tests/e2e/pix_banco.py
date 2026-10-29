# Teste de navegador do simulador de banco: escolha do banco, passos que mudam por banco,
# ajuda adaptativa (me mostre, destaque, modo guiado), retomada e a variante "nome diferente".
# Requer: servidor em http://localhost:4173 (npm run build && npm run preview)
import json, sys
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

    # --- Pix pela chave num banco tradicional (Caixa): 13 passos ---
    page.get_by_role("button", name="Mundo 4: Banco e Pix", exact=True).click()
    page.get_by_role("button", name="Fazer um Pix pela chave").click()
    check("pede o banco antes de começar", page.get_by_role("heading", name="Qual é o seu banco?").is_visible())
    page.screenshot(path=f"{OUT}/p1-seletor.png", full_page=True)
    page.get_by_role("button", name="Caixa", exact=True).click()
    check("mostra a situação (cenário)", page.get_by_text("você vai pagar R$ 25,00 para a Ana").is_visible())
    check("banco tradicional tem 13 passos", passo(1, 13))
    page.screenshot(path=f"{OUT}/p2-entrar.png", full_page=True)

    toque("Entrar"); check("saldo escondido", page.get_by_text("Seu saldo: ••••••").is_visible())
    toque("👁 Mostrar saldo")
    check("saldo aparece depois", page.get_by_text("Seu saldo: R$ 1.250,00").is_visible())

    # ajuda adaptativa: 3 erros seguidos
    page.get_by_role("button", name="Extrato", exact=True).click()
    check("1 erro: mensagem gentil", page.get_by_text('Quase! Procure o botão escrito "Menu".').is_visible())
    page.get_by_role("button", name="Cartões", exact=True).click()
    check("2 erros: oferece mostrar onde tocar", page.get_by_role("button", name="Me mostre onde tocar").is_visible())
    check("ainda sem destaque", page.locator(".destacado").count() == 0)
    page.get_by_role("button", name="Investir", exact=True).click()
    check("3 erros: destaca o botão certo sozinho", page.locator(".destacado").count() >= 1)
    page.screenshot(path=f"{OUT}/p3-ajuda.png", full_page=True)
    page.get_by_role("button", name="Me mostre onde tocar").click()
    toque("☰ Menu")
    check("menu leva ao passo seguinte (Pagar e transferir)", passo(4, 13))
    toque("💸 Pagar e transferir")
    toque("💠 Pix")
    check("tela do Pix aberta", page.get_by_role("heading", name="Pix", exact=True).is_visible())

    # recarregar no meio: continua no mesmo banco, sem pedir o banco de novo
    page.reload()
    page.get_by_role("button", name="Mundo 4: Banco e Pix", exact=True).click()
    page.get_by_role("button", name="Fazer um Pix pela chave — continuar").click()
    check("retoma no mesmo banco e passo", passo(6, 13) and page.get_by_text("Banco escolhido: Caixa.").is_visible())

    toque("Transferir")
    toque("E-mail")
    campo = page.get_by_label("E-mail da pessoa")
    campo.fill("ana@exemplo.co"); page.get_by_role("button", name="Continuar").click()
    check("e-mail errado: erro gentil, não avança", page.get_by_text("Quase! Confira se está escrito ana@exemplo.com").is_visible())
    campo.fill("ana@exemplo.com"); page.get_by_role("button", name="Continuar").click()
    page.get_by_label("Valor em reais").fill("25"); page.get_by_role("button", name="Continuar").click()
    check("tela de conferência mostra nome e valor", page.get_by_text("Para: Ana Beatriz Souza").is_visible() and page.get_by_text("Valor: R$ 25,00").is_visible())
    toque("Sim, está certo")
    toque("Confirmar")
    # teclado de senha
    check("teclado de senha aparece", page.get_by_role("group", name="Teclado de números").is_visible())
    for d in "12": toque(d)
    check("bolinhas contam os números", page.get_by_label("2 números digitados").is_visible())
    page.get_by_role("button", name="Confirmar", exact=True).click()
    check("senha incompleta: erro gentil", page.get_by_text("Quase! A senha do exercício é 1234").is_visible())
    page.get_by_role("button", name="Apagar").click(); page.get_by_role("button", name="Apagar").click()
    for d in "1234": toque(d)
    page.screenshot(path=f"{OUT}/p4-senha.png", full_page=True)
    page.get_by_role("button", name="Confirmar", exact=True).click()
    check("comprovante", page.get_by_text("R$ 25,00 para Ana Beatriz Souza").is_visible())
    toque("Salvar comprovante")
    check("fase concluída", page.get_by_role("heading", name="Fase concluída!").is_visible())
    check("'me mostre' custou 1 dica: 2 estrelas", page.get_by_label("2 estrelas").is_visible())
    page.screenshot(path=f"{OUT}/p5-concluida.png", full_page=True)
    page.get_by_role("button", name="Voltar ao mapa").click()

    # --- variante: nome diferente, num banco digital (Nubank): 9 passos, e modo guiado ---
    page.get_by_role("button", name="Conferir o nome antes de enviar").click()
    check("lembra o último banco como sugestão", page.get_by_role("button", name="Continuar com Caixa").is_visible())
    page.get_by_role("button", name="Nubank", exact=True).click()
    check("banco digital tem menos passos (9)", passo(1, 9))
    page.get_by_role("button", name="Modo guiado: desligado").click()
    check("modo guiado mostra onde tocar", page.locator(".destacado").count() == 1)
    toque("Entrar"); toque("👁 Mostrar saldo")
    toque("💠 Pix")
    check("digital: Pix já está na tela inicial (sem menu)", passo(4, 9))
    toque("Enviar"); toque("E-mail")
    page.get_by_label("E-mail da pessoa").fill("ana@exemplo.com"); page.get_by_role("button", name="Continuar").click()
    page.get_by_label("Valor em reais").fill("25,00"); page.get_by_role("button", name="Continuar").click()
    check("nome da tela é de outra pessoa", page.get_by_text("Para: Carlos Alberto Lima").is_visible())
    toque("Sim, está certo")
    check("confirmar um nome diferente é recusado com aviso", page.get_by_text("Atenção! O nome na tela não é o da Ana").is_visible())
    toque("Não, está diferente")
    toque("Cancelar")
    check("variante concluída", page.get_by_role("heading", name="Fase concluída!").is_visible())
    check("modo guiado limita a 1 estrela", page.get_by_label("1 estrelas").is_visible())
    page.get_by_role("button", name="Voltar ao mapa").click()

    # trocar de banco no meio da fase recomeça
    page.get_by_role("button", name="Fazer um Pix pela chave — ★★ Rever").click()
    page.get_by_role("button", name="Continuar com Nubank").click()
    toque("Entrar")
    page.get_by_role("button", name="Trocar de banco").click()
    check("trocar de banco volta à lista", page.get_by_role("heading", name="Qual é o seu banco?").is_visible())
    page.get_by_role("button", name="Itaú", exact=True).click()
    check("novo banco começa do início", passo(1, 13) and page.get_by_text("Banco escolhido: Itaú.").is_visible())
    page.get_by_role("button", name="Modo guiado: ligado").click()  # volta ao normal

    # alto contraste e letra grande não quebram o simulador
    page.get_by_role("button", name="Alto contraste: desligado").click()
    for _ in range(4): page.get_by_role("button", name="Aumentar letra").click()
    page.screenshot(path=f"{OUT}/p6-contraste.png", full_page=True)
    check("sem rolagem horizontal com letra 200%", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))

    check("sem erros no console", not errors)
    if errors: print(errors)
    b.close()

sys.exit(1 if any(l.startswith("FALHA") for l in log) else 0)
