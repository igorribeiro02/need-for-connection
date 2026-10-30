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

    # --- Pix pela chave na Caixa (fluxo: Pix na tela inicial > Pagar/Transferir): 11 passos ---
    page.get_by_role("button", name="Mundo 4: Banco e Pix", exact=True).click()
    page.get_by_role("button", name="Fazer um Pix pela chave").click()
    check("pede o banco antes de começar", page.get_by_role("heading", name="Qual é o seu banco?").is_visible())
    page.screenshot(path=f"{OUT}/p1-seletor.png", full_page=True)
    page.get_by_role("button", name="Caixa / Caixa Tem", exact=True).click()
    check("mostra a situação (cenário)", page.get_by_text("você vai pagar R$ 25,00 para a Ana").is_visible())
    check("Caixa tem 11 passos", passo(1, 11))
    page.screenshot(path=f"{OUT}/p2-entrar.png", full_page=True)

    toque("Entrar"); check("saldo escondido atrás do botão", page.get_by_role("button", name="Mostrar saldo", exact=True).is_visible())
    page.screenshot(path=f"{OUT}/p2b-inicio-caixa.png", full_page=True)
    toque("Mostrar saldo")
    check("saldo aparece depois", page.locator(".inicio__saldo").get_by_text("R$ 1.250,00").is_visible())
    check("Caixa: 6 atalhos e 3 serviços, como na captura", page.locator(".inicio__atalho").count() == 6 and page.locator(".inicio__servico").count() == 3)
    check("Caixa: seção 'Movimente sua conta'", page.get_by_role("heading", name="Movimente sua conta").is_visible())

    # ajuda adaptativa: 3 erros seguidos
    page.get_by_role("button", name="Extrato", exact=True).click()
    check("1 erro: mensagem gentil", page.get_by_text('Quase! Procure o atalho escrito "Pix".').is_visible())
    page.get_by_role("button", name="Pague suas contas", exact=True).click()
    check("2 erros: oferece mostrar onde tocar", page.get_by_role("button", name="Me mostre onde tocar").is_visible())
    check("ainda sem destaque", page.locator(".destacado").count() == 0)
    page.get_by_role("button", name="Saque sem cartão", exact=True).click()
    check("3 erros: destaca o atalho certo sozinho", page.locator(".destacado").count() >= 1)
    page.screenshot(path=f"{OUT}/p3-ajuda.png", full_page=True)
    page.get_by_role("button", name="Me mostre onde tocar").click()
    page.get_by_role("button", name="Pix", exact=True).click()
    check("Pix leva ao passo seguinte", passo(4, 11))
    toque("Pagar/Transferir")
    check("tela de tipo de chave", page.get_by_role("heading", name="Para quem você quer enviar?").is_visible())

    # recarregar no meio: continua no mesmo banco, sem pedir o banco de novo
    page.reload()
    page.get_by_role("button", name="Mundo 4: Banco e Pix", exact=True).click()
    page.get_by_role("button", name="Fazer um Pix pela chave — continuar").click()
    check("retoma no mesmo banco e passo", passo(5, 11) and page.get_by_text("Banco escolhido: Caixa / Caixa Tem.").is_visible())

    toque("E-mail")
    campo = page.get_by_label("E-mail da pessoa")
    campo.fill("ana@exemplo.co"); page.get_by_role("button", name="Continuar").click()
    check("e-mail errado: erro gentil, não avança", page.get_by_text("Quase! Confira se está escrito ana@exemplo.com").is_visible())
    campo.fill("ana@exemplo.com"); page.get_by_role("button", name="Continuar").click()
    page.get_by_label("Valor em reais").fill("25"); page.get_by_role("button", name="Continuar").click()
    check("conferência mostra nome e valor", page.locator(".banco__resumo").get_by_text("Ana Beatriz Souza").is_visible() and page.locator(".banco__resumo").get_by_text("R$ 25,00").is_visible())
    page.screenshot(path=f"{OUT}/p3b-conferencia.png", full_page=True)
    toque("Sim, está certo")
    toque("Continuar")
    check("Caixa pede assinatura eletrônica no teclado", page.get_by_role("heading", name="Digite a sua assinatura eletrônica").is_visible())
    for d in "12": toque(d)
    check("bolinhas contam os números", page.get_by_label("2 números digitados").is_visible())
    page.get_by_role("button", name="Confirmar", exact=True).click()
    check("senha incompleta: erro gentil", page.get_by_text("Quase! A senha do exercício é 1234").is_visible())
    page.get_by_role("button", name="Apagar").click(); page.get_by_role("button", name="Apagar").click()
    for d in "1234": toque(d)
    page.screenshot(path=f"{OUT}/p4-senha.png", full_page=True)
    page.get_by_role("button", name="Confirmar", exact=True).click()
    check("comprovante", page.get_by_text("Pix enviado ✓").is_visible())
    toque("Salvar comprovante")
    check("fase concluída", page.get_by_role("heading", name="Fase concluída!").is_visible())
    check("'me mostre' custou 1 dica: 2 estrelas", page.get_by_label("2 estrelas").is_visible())
    page.get_by_role("button", name="Voltar ao mapa").click()

    # --- variante do nome diferente no Banco do Brasil (confirma o destinatário logo depois da chave): 8 passos, modo guiado ---
    page.get_by_role("button", name="Conferir o nome antes de enviar").click()
    check("lembra o último banco como sugestão", page.get_by_role("button", name="Continuar com Caixa / Caixa Tem").is_visible())
    page.get_by_role("button", name="Banco do Brasil", exact=True).click()
    check("variante no BB tem 8 passos (para na conferência)", passo(1, 8))
    page.get_by_role("button", name="Modo guiado: desligado").click()
    check("modo guiado mostra onde tocar", page.locator(".destacado").count() == 1)
    toque("Entrar"); toque("Mostrar saldo"); toque("Pix"); toque("Pagar ou transferir"); toque("E-mail")
    page.get_by_label("E-mail da pessoa").fill("ana@exemplo.com"); page.get_by_role("button", name="Avançar").click()
    check("BB usa o botão Avançar e mostra 'Confirme quem vai receber'", page.get_by_role("heading", name="Confirme quem vai receber").is_visible())
    check("o nome na tela é de outra pessoa", page.locator(".banco__resumo").get_by_text("Carlos Alberto Lima").is_visible())
    toque("Sim, está certo")
    check("confirmar um nome diferente é recusado com aviso", page.get_by_text("Atenção! O nome na tela não é o da Ana").is_visible())
    toque("Não, está diferente")
    toque("Cancelar")
    check("variante concluída", page.get_by_role("heading", name="Fase concluída!").is_visible())
    check("modo guiado limita a 1 estrela", page.get_by_label("1 estrelas").is_visible())
    page.get_by_role("button", name="Voltar ao mapa").click()
    page.get_by_role("button", name="Conferir o nome antes de enviar — ★ Rever").click()
    page.get_by_role("button", name="Continuar com Banco do Brasil").click()
    page.get_by_role("button", name="Modo guiado: ligado").click()  # desliga
    page.get_by_role("button", name="Voltar ao mapa").click()

    # --- Pix completo no BB: confirmar destinatário, conta, valor, data e senha de 6 números (13 passos) ---
    page.get_by_role("button", name="Fazer um Pix pela chave — ★★ Rever").click()
    page.get_by_role("button", name="Continuar com Banco do Brasil").click()
    check("BB tem 13 passos", passo(1, 13))
    toque("Entrar"); toque("Mostrar saldo"); toque("Pix"); toque("Pagar ou transferir"); toque("E-mail")
    page.get_by_label("E-mail da pessoa").fill("ana@exemplo.com"); page.get_by_role("button", name="Avançar").click()
    toque("Sim, está certo")
    check("BB: a conta vem antes do valor", page.get_by_role("heading", name="De qual conta?").is_visible())
    toque("Conta corrente")
    page.get_by_label("Valor em reais").fill("25,00"); page.get_by_role("button", name="Avançar").click()
    check("BB: pergunta a data", page.get_by_role("heading", name="Quando você quer enviar?").is_visible())
    toque("Hoje")
    toque("Confirmar")
    check("BB pede senha de 6 números", page.get_by_role("heading", name="Digite a sua senha de 6 números").is_visible())
    for d in "123456": toque(d)
    page.get_by_role("button", name="Confirmar", exact=True).click()
    toque("Salvar comprovante")
    check("Pix no BB concluído", page.get_by_role("heading", name="Fase concluída!").is_visible())
    page.get_by_role("button", name="Voltar ao mapa").click()

    # --- Nubank: valor antes da chave; trocar de banco recomeça ---
    check("sem ajuda, o Pix no BB rendeu 3 estrelas", page.get_by_role("button", name="Fazer um Pix pela chave — ★★★ Rever").is_visible())
    page.get_by_role("button", name="Fazer um Pix pela chave — ★★★ Rever").click()
    page.get_by_role("button", name="Nubank", exact=True).click()
    check("Nubank tem 11 passos", passo(1, 11))
    toque("Entrar"); toque("Mostrar saldo"); toque("Área Pix"); toque("Transferir")
    check("Nubank pede o valor antes da chave", page.get_by_label("Valor em reais").is_visible())
    page.screenshot(path=f"{OUT}/p5-nubank-valor.png", full_page=True)
    page.get_by_role("button", name="Trocar de banco").click()
    check("trocar de banco volta à lista", page.get_by_role("heading", name="Qual é o seu banco?").is_visible())
    page.get_by_role("button", name="Itaú", exact=True).click()
    check("novo banco começa do início (Itaú: 11 passos)", passo(1, 11) and page.get_by_text("Banco escolhido: Itaú.").is_visible())
    toque("Entrar"); toque("Mostrar saldo")
    page.screenshot(path=f"{OUT}/p5b-itau-home.png", full_page=True)

    # --- Bradesco: a tela do Pix tem o campo da chave (sem escolher o tipo); 10 passos ---
    page.get_by_role("button", name="Trocar de banco").click()
    page.get_by_role("button", name="Bradesco", exact=True).click()
    check("Bradesco tem 10 passos", passo(1, 10))
    toque("Entrar"); toque("Mostrar saldo"); toque("Pix")
    check("tela do Pix: pergunta 'Como você quer transferir?'", page.get_by_role("heading", name="Como você quer transferir?").is_visible())
    check("tela do Pix: campo, botões de apoio e outros serviços",
          page.get_by_label("Digitar ou colar nome/chave").is_visible()
          and page.get_by_role("button", name="Escolher um contato").is_visible()
          and page.get_by_role("button", name="Ler um QR Code").is_visible()
          and page.get_by_role("heading", name="Outros Serviços").is_visible()
          and page.get_by_role("button", name="Limites Pix").is_visible())
    check("não pede o tipo de chave antes", not page.get_by_text("Para quem você quer enviar?").is_visible())
    page.screenshot(path=f"{OUT}/p5c-bradesco-pix.png", full_page=True)
    page.get_by_role("button", name="Ler um QR Code").click()
    check("botão que não faz parte do exercício avisa com calma", page.get_by_role("status").get_by_text("não funciona neste exercício").is_visible())
    page.get_by_label("Digitar ou colar nome/chave").fill("ana@exemplo.com")
    page.get_by_role("button", name="Continuar", exact=True).click()
    check("depois da chave vem o valor", page.get_by_label("Valor em reais").is_visible())
    page.get_by_label("Valor em reais").fill("25"); page.get_by_role("button", name="Continuar", exact=True).click()
    toque("Conta corrente")
    check("Bradesco confere o nome no fim", page.get_by_text("Confira antes de enviar").is_visible())
    toque("Sim, está certo"); toque("Confirmar")
    for d in "1234": page.get_by_role("button", name=d, exact=True).click()
    page.get_by_role("button", name="Confirmar", exact=True).click()
    check("Bradesco termina no comprovante", page.get_by_role("button", name="Salvar comprovante", exact=True).is_visible())

    # alto contraste e letra grande não quebram o simulador
    page.get_by_role("button", name="Alto contraste: desligado").click()
    for _ in range(4): page.get_by_role("button", name="Aumentar letra").click()
    page.screenshot(path=f"{OUT}/p6-contraste.png", full_page=True)
    check("sem rolagem horizontal com letra 200%", page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"))

    check("sem erros no console", not errors)
    if errors: print(errors)
    b.close()

sys.exit(1 if any(l.startswith("FALHA") for l in log) else 0)
