// PIN de 4 dígitos: trava de conveniência para separar perfis no mesmo aparelho.
// Não é segurança de verdade (o dado fica no próprio navegador).

export async function hashPin(pin: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) return `plain:${pin}`
  const dados = new TextEncoder().encode(`nfc:${pin}`)
  const digest = await subtle.digest('SHA-256', dados)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function conferePin(pin: string, pinHash: string): Promise<boolean> {
  return (await hashPin(pin)) === pinHash
}

export function pinValido(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}
