// Código de backup: texto que a pessoa (ou o familiar) guarda para recuperar o
// progresso se o cache do navegador for apagado. Formato: NFC1-<base64 do JSON>-<verificação>.

import { migrar, type DadosPerfil } from './schema'

const MARCA = 'NFC1'

function paraBase64(texto: string): string {
  const bytes = new TextEncoder().encode(texto)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function deBase64(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4)
  const bin = atob(padded)
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Verificação curta para detectar código copiado pela metade. */
function verificacao(texto: string): string {
  let h = 5381
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export function exportarCodigo(dados: DadosPerfil): string {
  const corpo = paraBase64(JSON.stringify(dados))
  return `${MARCA}-${corpo}-${verificacao(corpo)}`
}

export type ResultadoImportacao =
  | { ok: true; dados: DadosPerfil }
  | { ok: false; motivo: 'formato' | 'incompleto' | 'versao' }

export function importarCodigo(codigo: string): ResultadoImportacao {
  const limpo = codigo.replace(/\s+/g, '')
  const partes = limpo.split('-')
  // o base64 em formato URL pode conter "-", então a marca e a verificação ficam nas pontas
  if (partes.length < 3 || partes[0] !== MARCA) return { ok: false, motivo: 'formato' }
  const check = partes[partes.length - 1]
  const corpo = partes.slice(1, -1).join('-')
  if (verificacao(corpo) !== check) return { ok: false, motivo: 'incompleto' }

  try {
    const dados = migrar(JSON.parse(deBase64(corpo)))
    if (!dados) return { ok: false, motivo: 'versao' }
    return { ok: true, dados }
  } catch {
    return { ok: false, motivo: 'formato' }
  }
}
