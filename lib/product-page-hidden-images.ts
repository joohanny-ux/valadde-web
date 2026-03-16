import * as fs from 'fs'
import * as path from 'path'

const HIDDEN_PATH = path.join(process.cwd(), 'products', 'product_page_hidden_images.json')

type HiddenStore = Record<string, string[]>

function readStore(): HiddenStore {
  try {
    const data = JSON.parse(fs.readFileSync(HIDDEN_PATH, 'utf-8'))
    return typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

function writeStore(store: HiddenStore): void {
  const dir = path.dirname(HIDDEN_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(HIDDEN_PATH, JSON.stringify(store, null, 2), 'utf-8')
}

export function getHiddenFilenames(productId: string): string[] {
  const store = readStore()
  return store[productId] ?? []
}

export function hideImage(productId: string, filename: string): void {
  const store = readStore()
  const list = store[productId] ?? []
  if (!list.includes(filename)) {
    list.push(filename)
    store[productId] = list
    writeStore(store)
  }
}

export function unhideImage(productId: string, filename: string): void {
  const store = readStore()
  const list = store[productId] ?? []
  const next = list.filter((f) => f !== filename)
  if (next.length === 0) delete store[productId]
  else store[productId] = next
  writeStore(store)
}
