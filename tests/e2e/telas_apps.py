# Teste de navegador das telas copiadas de apps reais: Inter (fluxo completo), PicPay e Mercado Pago (até onde temos telas).
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
    def abrir(banco, primeira=False):
        if primeira:
            page.get_by_role("button", name="Mundo 4: Banco e Pix", exact=True).click()
            page.get_by_role("button", name="Fazer um Pix pela chave").click()
        else:
            page.get_by_role("button", name="Trocar de banco").click()
        page.get_by_role("button", name=banco, exact=True).click()

    # ---------------- Inter: 10 passos ----------------
    abrir("Inter", primeira=True)
    check("Inter tem 10 passos", passo(1, 10))
    toque("Entrar")
    shot("inter-1-inicio")
    check("Inter: saldo escondido com olho no alto", page.get_by_role("button", name="Mostrar saldo").is_visible())
    # errar de propósito mostra a dica gentil e não perde estrela
    page.get_by_role("button", name="Ajuda").click()
    check("botão de enfeite avisa com calma", page.get_by_role("status").get_by_text("não funciona neste exercício").is_visible())
    page.get_by_role("button", name="Mostrar saldo").click()
    check("Inter: saldo aparece", page.get_by_text("R$ 1.250,00").first.is_visible())
    shot("inter-2-saldo")
    toque("Pix")
    shot("inter-3-pix")
    check("Inter: tela Pix tem Pagar, Receber e Seguro", page.get_by_role("button", name="Pagar", exact=True).is_visible() and page.get_by_role("button", name="Receber", exact=True).is_visible() and page.get_by_text("Conheça o Seguro Pix").is_visible())
    toque("Pagar")
    shot("inter-4-pagar")
    check("Inter: Pagar com Pix tem a caixa da chave e Outros pagamentos", page.get_by_label("Chave, Copia e Cola ou Perfil do Fórum").is_visible() and page.get_by_role("heading", name="Outros pagamentos").is_visible())
    page.get_by_label("Chave, Copia e Cola ou Perfil do Fórum").fill("ana@exemplo.com")
    page.get_by_role("button", name="Continuar", exact=True).click()
    shot("inter-5-valor")
    check("Inter: Valor a pagar mostra 'Pagar para' e o nome da Ana", page.get_by_text("Pagar para", exact=True).is_visible() and page.get_by_text("Ana Beatriz Souza").first.is_visible())
    page.get_by_label("Valor em reais").fill("25"); page.get_by_role("button", name="Continuar", exact=True).click()
    shot("inter-6-revisao")
    check("Inter: Revisão mostra 'Quem vai receber' e a pergunta do exercício", page.get_by_role("heading", name="Quem vai receber").is_visible() and page.get_by_text("Pergunta do exercício").is_visible())
    page.get_by_role("button", name="Pagar R$ 25,00").click()
    check("Inter: Pagar ainda bloqueado antes de responder", page.get_by_role("status").get_by_text("Primeiro responda").is_visible())
    toque("Sim, está certo")
    page.get_by_role("button", name="Pagar R$ 25,00").click()
    shot("inter-7-autenticar")
    check("Inter: folha do iSafe aparece", page.get_by_text("autenticar sua transação pelo iSafe").is_visible())
    toque("CONFIRMAR")
    check("Inter termina no comprovante", page.get_by_role("button", name="Salvar comprovante", exact=True).is_visible())
    shot("inter-8-comprovante")

    # ---------------- PicPay: até a escolha do destinatário ----------------
    abrir("PicPay")
    toque("Entrar")
    shot("picpay-1-inicio")
    check("PicPay: iniciais do jogador no avatar", page.locator(".app__avatar").first.inner_text().strip() == "SJ")
    page.get_by_role("button", name="Mostrar saldo").click()
    toque("Pix")
    shot("picpay-2-area-pix")
    check("PicPay: Área Pix tem Transferir, Pagar QR Code e Meus contatos", page.get_by_role("heading", name="Área Pix").is_visible() and page.get_by_role("button", name="Pagar QR Code").is_visible() and page.get_by_role("heading", name="Meus contatos").is_visible())
    page.get_by_role("button", name="Transferir").click()
    shot("picpay-3-escolha")
    check("PicPay: 'Escolha pra quem transferir' com a caixa da chave", page.get_by_role("heading", name="Escolha pra quem transferir").is_visible() and page.get_by_label("CPF, CNPJ, chave Pix ou nome").is_visible())
    page.get_by_label("CPF, CNPJ, chave Pix ou nome").fill("ana@exemplo.com")
    page.get_by_role("button", name="Avançar", exact=True).click()
    check("PicPay: depois da chave vem o valor", page.get_by_label("Valor em reais").is_visible())

    # ---------------- Mercado Pago: início e tela do Pix ----------------
    abrir("Mercado Pago")
    toque("Entrar")
    shot("mp-1-inicio")
    check("Mercado Pago: saudação com o primeiro nome", page.get_by_text("Olá, Seu").first.is_visible())
    page.get_by_role("button", name="Mostrar saldo").click()
    toque("Pix")
    shot("mp-2-pix")
    check("Mercado Pago: tela Pix com 'Informe o que você quer fazer'", page.get_by_label("Informe o que você quer fazer").is_visible() and page.get_by_role("heading", name="Todos os contatos").is_visible())
    page.get_by_label("Informe o que você quer fazer").fill("ana@exemplo.com")
    page.get_by_role("button", name="Continuar", exact=True).click()
    check("Mercado Pago: depois da chave vem o valor", page.get_by_label("Valor em reais").is_visible())

    # ---------------- ajuda e acessibilidade nas telas copiadas ----------------
    abrir("Inter")
    toque("Entrar")
    for _ in range(3): page.get_by_role("button", name="Brasil").click()  # enfeites não contam como erro
    check("enfeites não ativam a ajuda automática", not page.get_by_role("button", name="Me mostre onde tocar").is_visible())
    page.get_by_role("button", name="Alto contraste: desligado").click()
    for _ in range(4): page.get_by_role("button", name="Aumentar letra").click()
    shot("inter-contraste-200")
    check("sem rolagem horizontal com letra 200% (Inter, alto contraste)", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))
    page.get_by_role("button", name="Alto contraste: ligado").click()
    for _ in range(4): page.get_by_role("button", name="Diminuir letra").click()
    for nome, sel in [("PicPay", "PicPay"), ("Mercado Pago", "Mercado Pago")]:
        abrir(nome); toque("Entrar")
    for _ in range(4): page.get_by_role("button", name="Aumentar letra").click()
    check("sem rolagem horizontal com letra 200% (Mercado Pago)", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))

    check("sem erros no console", not errors)
    if errors: print(errors)
    b.close()

sys.exit(1 if any(l.startswith("FALHA") for l in log) else 0)
