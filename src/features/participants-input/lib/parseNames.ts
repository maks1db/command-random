// Разбивает введённый текст на уникальные имена участников.
// Разделители: перенос строки, запятая, точка с запятой.
export const parseNames = (text: string): string[] => {
  const seen = new Set<string>()
  const names: string[] = []

  for (const raw of text.split(/[\n,;]+/)) {
    const name = raw.trim().replace(/\s+/g, ' ')
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    names.push(name)
  }

  return names
}
