// Guarda só o último texto que a pessoa escreveu num exercício, para as telas seguintes mostrarem a mensagem dela
// (ex.: o balão verde "Eu vou, Ana!" depois de enviar). Não é salvo em lugar nenhum e some ao fechar a página.
let ultimo = ''

export function guardarDigitacao(texto: string): void {
  ultimo = texto.trim()
}

export function ultimaDigitacao(): string {
  return ultimo
}
