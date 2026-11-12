/**
 * Article text format (same rules as the hint in the Clinika admin panel):
 * blank line = new paragraph, a line starting with "## " = heading, lines starting with "- " = list.
 * Rendered as plain Vue text nodes (never v-html), so no markup from the text can run.
 */
export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; lines: string[] }
  | { type: 'list'; items: string[] }

export function parseBlocks(source: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flush = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', lines: paragraph })
    if (list.length) blocks.push({ type: 'list', items: list })
    paragraph = []
    list = []
  }

  for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim()
    if (!line) {
      flush()
    } else if (/^##(\s|$)/.test(line)) {
      flush()
      const text = line.slice(2).trim()
      if (text) blocks.push({ type: 'heading', text })
    } else if (/^[-•*](\s|$)/.test(line)) {
      if (paragraph.length) {
        blocks.push({ type: 'paragraph', lines: paragraph })
        paragraph = []
      }
      const item = line.slice(1).trim()
      if (item) list.push(item)
    } else {
      if (list.length) {
        blocks.push({ type: 'list', items: list })
        list = []
      }
      paragraph.push(line)
    }
  }
  flush()
  return blocks
}
