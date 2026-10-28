/**
 * Strip characters that would let a value break out of the text node or HTML
 * attribute it is rendered into. Applied to every user-supplied string before it
 * is displayed or persisted.
 */
export function sanitize(input: string): string {
  return String(input ?? '').replace(/[<>&"'`]/g, '').trim()
}