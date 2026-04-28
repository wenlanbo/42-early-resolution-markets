import * as React from 'react'

type Block =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'quote'; text: string }

const RX_H2 = /^##\s+/
const RX_H3 = /^###\s+/
const RX_UL = /^[-*]\s+/
const RX_OL = /^\d+[).]\s*/
const RX_QUOTE = /^>\s?/

function nextNonEmpty(lines: string[], from: number): number {
  let j = from
  while (j < lines.length && !lines[j].trim()) j++
  return j
}

function collectList(
  lines: string[],
  start: number,
  rx: RegExp
): { items: string[]; next: number } {
  const items: string[] = []
  let i = start
  while (i < lines.length) {
    const t = lines[i].trim()
    if (!t) {
      const j = nextNonEmpty(lines, i + 1)
      if (j < lines.length && rx.test(lines[j].trim())) {
        i = j
        continue
      }
      break
    }
    if (!rx.test(t)) break
    items.push(t.replace(rx, '').trim())
    i++
  }
  return { items, next: i }
}

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (!trimmed) {
      i++
      continue
    }

    if (RX_H3.test(trimmed)) {
      blocks.push({ kind: 'h3', text: trimmed.replace(RX_H3, '') })
      i++
      continue
    }
    if (RX_H2.test(trimmed)) {
      blocks.push({ kind: 'h2', text: trimmed.replace(RX_H2, '') })
      i++
      continue
    }

    if (RX_QUOTE.test(trimmed)) {
      const lines2: string[] = []
      while (i < lines.length && RX_QUOTE.test(lines[i].trim())) {
        lines2.push(lines[i].trim().replace(RX_QUOTE, ''))
        i++
      }
      blocks.push({ kind: 'quote', text: lines2.join(' ') })
      continue
    }

    if (RX_UL.test(trimmed)) {
      const { items, next } = collectList(lines, i, RX_UL)
      blocks.push({ kind: 'ul', items })
      i = next
      continue
    }

    if (RX_OL.test(trimmed)) {
      const { items, next } = collectList(lines, i, RX_OL)
      blocks.push({ kind: 'ol', items })
      i = next
      continue
    }

    const para: string[] = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (!t) break
      if (RX_H2.test(t) || RX_H3.test(t)) break
      if (RX_UL.test(t) || RX_OL.test(t) || RX_QUOTE.test(t)) break
      para.push(t)
      i++
    }
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ') })
  }

  return blocks
}

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const re =
    /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*\n]+)\*\*)|(`([^`\n]+)`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      out.push(
        <a
          key={`${keyBase}-${i++}`}
          href={m[3]}
          target="_blank"
          rel="noreferrer"
          className="text-text-brand underline-offset-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {m[2]}
        </a>
      )
    } else if (m[4]) {
      out.push(
        <strong
          key={`${keyBase}-${i++}`}
          className="text-text-primary font-semibold"
        >
          {m[5]}
        </strong>
      )
    } else if (m[6]) {
      out.push(
        <code
          key={`${keyBase}-${i++}`}
          className="bg-surface-chip text-text-primary rounded px-1 py-0.5 font-mono text-[12px]"
        >
          {m[7]}
        </code>
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ source }: { source: string }) {
  const blocks = parseBlocks(source)
  return (
    <div className="text-text-secondary space-y-3 text-sm leading-relaxed">
      {blocks.map((b, idx) => {
        const k = `b${idx}`
        switch (b.kind) {
          case 'h2':
            return (
              <h3
                key={k}
                className="text-text-primary mt-5 mb-1 text-base font-semibold first:mt-0"
              >
                {renderInline(b.text, k)}
              </h3>
            )
          case 'h3':
            return (
              <h4
                key={k}
                className="text-text-primary mt-4 mb-1 text-sm font-semibold first:mt-0"
              >
                {renderInline(b.text, k)}
              </h4>
            )
          case 'p':
            return (
              <p key={k} className="whitespace-pre-line">
                {renderInline(b.text, k)}
              </p>
            )
          case 'ul':
            return (
              <ul key={k} className="space-y-1.5">
                {b.items.map((it, j) => (
                  <li
                    key={`${k}-${j}`}
                    className="grid grid-cols-[0.75rem_1fr] gap-x-2"
                  >
                    <span className="text-text-muted leading-relaxed">•</span>
                    <span>{renderInline(it, `${k}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={k} className="space-y-1.5">
                {b.items.map((it, j) => (
                  <li
                    key={`${k}-${j}`}
                    className="grid grid-cols-[1.5rem_1fr] gap-x-2"
                  >
                    <span className="text-text-muted text-right leading-relaxed tabular-nums">
                      {j + 1}.
                    </span>
                    <span>{renderInline(it, `${k}-${j}`)}</span>
                  </li>
                ))}
              </ol>
            )
          case 'quote':
            return (
              <blockquote
                key={k}
                className="border-text-brand/40 text-text-secondary border-l-2 pl-3 italic"
              >
                {renderInline(b.text, k)}
              </blockquote>
            )
        }
      })}
    </div>
  )
}
