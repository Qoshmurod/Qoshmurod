/**
 * Article text format (same rules as the hint in the Clinika admin panel):
 * blank line = new paragraph, a line starting with "## " = heading, lines starting with "- " = list.
 * Rendered as plain Vue text nodes (never v-html), so no markup from the text can run.
 */
export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'image'; n: number }
  | { type: 'paragraph'; lines: string[] }
  | { type: 'list'; items: string[] }

/** A line "[rasm 2]" (also in Cyrillic or other languages) shows gallery picture 2 at that place. */
const IMAGE_LINE = /^\[\s*(?:rasm|расм|image|img|photo|фото|resim|изображение)\s*(\d{1,2})\s*\]$/iu

/** Picture numbers used inside the text, so the gallery under it can leave them out. */
export function inlineImageNumbers(source: string): Set<number> {
  const used = new Set<number>()
  for (const raw of source.split(/\r?\n/)) {
    const m = IMAGE_LINE.exec(raw.trim())
    if (m) used.add(Number(m[1]))
  }
  return used
}

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
    const image = IMAGE_LINE.exec(line)
    if (!line) {
      flush()
    } else if (image) {
      flush()
      blocks.push({ type: 'image', n: Number(image[1]) })
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
