// Narração com a voz do próprio navegador (Web Speech API). Depende do aparelho,
// por isso o texto sempre aparece na tela também. Nada toca sozinho.

export function narracaoDisponivel(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function falar(texto: string): void {
  if (!narracaoDisponivel()) return
  window.speechSynthesis.cancel()
  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = 'pt-BR'
  fala.rate = 0.9
  window.speechSynthesis.speak(fala)
}
