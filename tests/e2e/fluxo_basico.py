# Teste de navegador do fluxo completo (cadastro, fase, retomar, backup, PIN).
# Requer: pip install playwright && playwright install chromium
import re
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:4173/"
OUT = "."
log = []
def check(nome, cond):
    log.append(("OK  " if cond else "FALHA ") + nome)
    return cond

def abrir_ajustes(page):
    b = page.get_by_role("button", name="Ajustes", exact=True)
    if b.count() and b.get_attribute("aria-expanded") != "true": b.click()

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 800})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.goto(URL)

    # cadastro
    check("tela de cadastro aparece no primeiro acesso", page.get_by_role("heading", name="Criar meu perfil").is_visible())
    page.get_by_label("Como você quer ser chamado?").fill("Dona Maria")
    page.get_by_role("button", name="Figura 👵").click()
    page.get_by_role("button", name="Começar").click()
    check("mapa mostra o nome", page.get_by_role("heading", name="Olá, 👵 Dona Maria!").is_visible())
    page.screenshot(path=f"{OUT}/1-mapa.png", full_page=True)

    # fase: errar, pedir dica, acertar 1 passo, recarregar
    page.get_by_role("button", name="Destrancar o celular").click()
    check("abre com a cena de história da Dona Neuza", page.get_by_text("Bem-vindo à Vila Conexão").is_visible())
    page.get_by_role("button", name="Pular história").click()
    check("passo 1 de 4", page.get_by_text("Passo 1 de 4").is_visible())
    page.get_by_role("button", name="Apagar tudo").click()
    check("erro gentil aparece", page.get_by_text("Procure o botão").count() > 0)
    check("errar não avançou", page.get_by_text("Passo 1 de 4").is_visible())
    page.get_by_role("button", name="Preciso de uma dica").click()
    check("dica aparece", page.get_by_text("Procure o botão").count() > 0)
    page.screenshot(path=f"{OUT}/2-fase.png", full_page=True)
    page.get_by_role("button", name="Acordar o celular").click()
    check("avançou para passo 2", page.get_by_text("Passo 2 de 4").is_visible())

    page.reload()
    check("após recarregar continua logada (mapa)", page.get_by_role("heading", name="Olá, 👵 Dona Maria!").is_visible())
    check("mapa oferece continuar", page.get_by_role("button", name="Destrancar o celular — continuar").is_visible())
    page.get_by_role("button", name="Destrancar o celular — continuar").click()
    check("retoma no passo 2", page.get_by_text("Passo 2 de 4").is_visible())

    page.get_by_role("button", name="Deslizar para cima").click()
    page.get_by_label("Código").fill("2580")
    page.get_by_role("button", name="OK", exact=True).click()
    check("passo 4 de 4", page.get_by_text("Passo 4 de 4").is_visible())
    page.get_by_role("button", name="Anotar num bilhete dentro da capinha").click()
    check("errar a escolha não avança", page.get_by_text("Passo 4 de 4").is_visible())
    page.get_by_role("button", name="Decorar e não contar a ninguém").click()
    check("cena de fechamento mostra o prêmio", page.get_by_text("O código certo").is_visible())
    page.get_by_role("button", name="Continuar", exact=True).click()
    check("fase concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    check("2 estrelas (usou 1 dica)", page.get_by_label("2 estrelas").is_visible())
    page.screenshot(path=f"{OUT}/3-concluida.png", full_page=True)
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()
    check("mapa mostra estrelas e Rever", page.get_by_role("button", name="Destrancar o celular — ★★ Rever").is_visible())

    # ajustes de acessibilidade
    page.get_by_role("button", name="Aumentar letra").click()
    abrir_ajustes(page)
    page.get_by_role("button", name="Alto contraste: desligado").click()
    check("alto contraste aplicado", page.evaluate("document.documentElement.dataset.contraste") == "alto")
    page.screenshot(path=f"{OUT}/4-contraste.png", full_page=True)

    # backup: exportar, limpar tudo, importar
    page.get_by_role("button", name="Guardar meu progresso").click()
    codigo = page.get_by_label("Código do meu progresso").input_value()
    check("código gerado", codigo.startswith("NFC1-"))
    page.evaluate("localStorage.clear()")
    page.goto(URL)
    check("após limpar o cache volta ao cadastro", page.get_by_role("heading", name="Criar meu perfil").is_visible())
    page.get_by_role("button", name="Recuperar meu progresso com um código").click()
    page.get_by_label("Cole aqui o código").fill(codigo)
    page.get_by_role("button", name="Recuperar progresso").click()
    check("mensagem de recuperado", page.get_by_text("Progresso de Dona Maria recuperado.").is_visible())
    page.get_by_role("button", name="Voltar").click()
    check("progresso voltou (2 estrelas)", page.get_by_role("button", name="Destrancar o celular — ★★ Rever").is_visible())
    check("preferências voltaram (contraste)", page.evaluate("document.documentElement.dataset.contraste") == "alto")

    # PIN
    page.get_by_role("button", name="Trocar de perfil").click()
    page.get_by_role("button", name="Criar novo perfil").click()
    page.get_by_label("Como você quer ser chamado?").fill("Seu João")
    page.get_by_label("Número secreto (opcional)").fill("1234")
    page.get_by_role("button", name="Começar").click()
    page.get_by_role("button", name="Trocar de perfil").click()
    page.get_by_role("button", name="🙂 Seu João").click()
    page.get_by_label("Número secreto (4 dígitos)").fill("0000")
    page.get_by_role("button", name="Entrar").click()
    check("PIN errado é recusado", page.get_by_text("Esse número não confere").is_visible())
    page.get_by_label("Número secreto (4 dígitos)").fill("1234")
    page.get_by_role("button", name="Entrar").click()
    check("PIN certo entra", page.get_by_role("heading", name="Olá, 🙂 Seu João!").is_visible())

    check("sem erros no console", len(errors) == 0)
    if errors: log.append("  erros: " + " | ".join(errors[:5]))
    b.close()

print("\n".join(log))
sys.exit(1 if any(l.startswith("FALHA") for l in log) else 0)
