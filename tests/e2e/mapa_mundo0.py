# Teste de navegador do mapa com personagem e das fases do Mundo 0.
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

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.goto(URL)

    page.get_by_label("Como você quer ser chamado?").fill("Dona Maria")
    page.get_by_role("button", name="Figura 👵").click()
    page.get_by_role("button", name="Começar").click()

    grade = page.get_by_role("group", name="Mapa das fases. Use as setas do teclado para andar até a entrada de uma fase.")
    check("mapa aparece", grade.is_visible())
    check("novo jogador começa na entrada do Mundo 0", page.get_by_role("heading", name="Fase 0: Primeiros toques").is_visible())
    page.screenshot(path=f"{OUT}/m1-mapa.png", full_page=True)

    # teclado: do Mundo 0 (4,6) sobe 3 casas até a praça
    grade.focus()
    for _ in range(3):
        page.keyboard.press("ArrowUp")
    check("setas levam à praça", page.get_by_text("Você está na praça.").is_visible())
    # botões direcionais
    page.get_by_role("button", name="Andar para baixo").click()
    page.get_by_role("button", name="Andar para baixo").click()
    page.get_by_role("button", name="Andar para baixo").click()
    check("botão direcional leva de volta ao Mundo 0", page.get_by_role("heading", name="Fase 0: Primeiros toques").is_visible())

    # toque num prédio bloqueado: personagem anda sozinho até lá
    page.get_by_role("button", name="Fase 4: Banco e Pix (ainda bloqueado)").click()
    page.get_by_text("Ainda bloqueado.").wait_for(timeout=5000)
    check("Mundo 4 bloqueado até terminar o Mundo 0", page.get_by_text("Termine primeiro: Fase 0 (Primeiros toques)").is_visible())
    page.screenshot(path=f"{OUT}/m2-bloqueado.png", full_page=True)

    # modo lista (e lembra a escolha depois de recarregar)
    page.get_by_role("button", name="📋 Lista").click()
    check("lista mostra os 8 mundos", page.get_by_role("heading", level=2).count() == 8)
    page.reload()
    check("modo lista foi lembrado", page.get_by_role("heading", level=2).count() == 8)
    page.screenshot(path=f"{OUT}/m3-lista.png", full_page=True)

    # --- Mundo 0 ---
    def abrir_fase(nome):
        page.get_by_role("button", name=nome).first.click()
        pular = page.get_by_role("button", name="Pular história")
        if pular.count(): pular.click()

    def fechar_cena():
        page.get_by_role("button", name="Continuar", exact=True).click()

    abrir_fase("Tocar na tela")
    page.get_by_role("button", name="Começar").click()
    page.get_by_role("button", name="Verde").click()
    page.get_by_role("button", name="Confirmar", exact=True).click()
    page.get_by_role("button", name="Enviar depois", exact=True).click()
    page.get_by_role("button", name="Ana Maria", exact=True).click()
    fechar_cena()
    check("fase tocar concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # destrancar o celular (tela de app)
    abrir_fase("Destrancar o celular")
    page.get_by_role("button", name="Acordar o celular").click()
    page.get_by_role("button", name="Deslizar para cima").click()
    page.locator(".atividade__palco input").first.fill("2580"); page.get_by_role("button", name="OK", exact=True).click()
    page.get_by_role("button", name="Decorar e não contar a ninguém").click()
    fechar_cena()
    check("fase destrancar concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # tela inicial e aplicativos (voltar com a seta do app)
    abrir_fase("A tela inicial e os aplicativos")
    page.get_by_role("button", name="Telefone").click()
    page.get_by_role("button", name="Câmera").click()
    page.get_by_role("button", name="Voltar", exact=True).click()
    page.get_by_role("button", name="Mensagens").click()
    page.get_by_role("button", name="Início").click()
    fechar_cena()
    check("fase tela inicial concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # deslizar (com os botões; o gesto usa a mesma rolagem)
    abrir_fase("Deslizar a tela")
    page.screenshot(path=f"{OUT}/m4-deslizar.png", full_page=True)
    for _ in range(12):
        if page.get_by_text("Passo 2 de 2").count(): break
        page.get_by_role("button", name="▼ Descer").click(); page.wait_for_timeout(250)
    check("chegar ao fim da lista avança", page.get_by_text("Passo 2 de 2").is_visible())
    for _ in range(12):
        if page.get_by_role("button", name="Continuar", exact=True).count(): break
        page.get_by_role("button", name="▲ Subir").click(); page.wait_for_timeout(250)
    fechar_cena()
    check("voltar ao início conclui", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # deslizar de verdade com a roda do mouse na lista
    page.get_by_role("button", name="Deslizar a tela — ★★★ Rever").click()
    page.get_by_role("region", name="Lista de contatos").hover()
    page.mouse.wheel(0, 1500)
    page.get_by_text("Passo 2 de 2").wait_for(timeout=5000)
    check("rolar com a roda também funciona", True)
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # teclado
    abrir_fase("Digitar no teclado")
    campo = page.get_by_label("Escreva aqui")
    campo.fill("casa"); page.get_by_role("button", name="Pronto").click()
    check("palavra aceita", page.get_by_text("Passo 2 de 4").is_visible())
    campo = page.get_by_label("Escreva aqui")
    campo.fill("12"); page.get_by_role("button", name="Pronto").click()
    check("erro gentil ao digitar errado", page.get_by_text("Quase! Confira se está escrito 123.").is_visible())
    campo.fill("123"); page.get_by_role("button", name="Pronto").click()
    campo = page.get_by_label("Escreva aqui")
    check("passo de apagar já vem com 'casaa'", campo.input_value() == "casaa")
    campo.press("End"); campo.press("Backspace"); page.get_by_role("button", name="Pronto").click()
    campo = page.get_by_label("Escreva aqui")
    campo.fill("ANA@exemplo.com "); page.get_by_role("button", name="Pronto").click()
    fechar_cena()
    check("fase teclado concluída (ignora maiúsculas e espaço final)", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # andar
    abrir_fase("Andar com o personagem")
    page.screenshot(path=f"{OUT}/m5-andar.png", full_page=True)
    check("botão de confirmar começa desabilitado", page.get_by_role("button", name="Pegar (chegue até um objeto)").is_disabled())
    page.get_by_role("button", name="Maçã").click()
    page.get_by_role("button", name="Pegar: Maçã").wait_for(timeout=5000)
    page.get_by_role("button", name="Pegar: Maçã").click()
    check("pegou a maçã", page.get_by_text("Passo 2 de 3").is_visible())
    page.get_by_role("button", name="Porta").click()
    page.get_by_role("button", name="Pegar: Porta").wait_for(timeout=6000)
    page.get_by_role("button", name="Pegar: Porta").click()
    check("objeto errado dá erro gentil e não avança", page.get_by_text("Esse não é o objeto pedido. Procure a chave").is_visible())
    page.get_by_role("button", name="Preciso de uma dica").click()
    page.get_by_role("button", name="Preciso de uma dica").click()
    check("última dica destaca o alvo", page.locator(".destacado").count() == 1)
    page.get_by_role("button", name="Chave").click()
    page.get_by_role("button", name="Pegar: Chave").wait_for(timeout=6000)
    page.get_by_role("button", name="Pegar: Chave").click()
    page.get_by_role("button", name="Porta").click()
    page.get_by_role("button", name="Abrir: Porta").wait_for(timeout=6000)
    page.get_by_role("button", name="Abrir: Porta").click()
    fechar_cena()
    check("fase andar concluída", page.get_by_role("heading", name="Você conseguiu!").is_visible())
    page.get_by_role("button", name="Continuar a história").click()
    check("cena final do mundo 0: convite da Ana", page.get_by_text("Oi,").is_visible())
    page.screenshot(path=f"{OUT}/m6-final-mundo0.png", full_page=True)
    fechar_cena(); fechar_cena()
    check("cena final entrega o prêmio do convite", page.get_by_text("O convite da Ana").is_visible())
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()
    page.get_by_role("button", name="Álbum da Ana").click()
    check("álbum mostra as páginas ganhas", page.get_by_text(re.compile(r"\d+ de \d+ páginas")).first.is_visible())
    page.screenshot(path=f"{OUT}/m7-album.png", full_page=True)
    page.get_by_role("button", name=re.compile(r"^(← Mapa|← Voltar ao mapa|Voltar ao mapa)$")).first.click()

    # liberação
    page.get_by_role("button", name="🗺️ Mapa").click()
    check("Mundo 0 concluído libera os outros", page.get_by_role("button", name="Fase 4: Banco e Pix", exact=True).count() == 1)
    page.get_by_role("button", name="Fase 4: Banco e Pix").click()
    page.get_by_role("button", name="Fazer um Pix pela chave").wait_for(timeout=6000)
    check("Mundo 4 agora está aberto e mostra as fases de Pix", True)
    page.screenshot(path=f"{OUT}/m6-liberado.png", full_page=True)

    # movimento reduzido: o personagem não deve explodir nada, só chegar
    # (a opção é do sistema; aqui conferimos apenas que não houve erros de página)
    check("sem erros no console", not errors)
    if errors: print(errors)
    b.close()

sys.exit(1 if any(l.startswith("FALHA") for l in log) else 0)
