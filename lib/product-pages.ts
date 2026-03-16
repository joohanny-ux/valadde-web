import * as fs from 'fs'
import * as path from 'path'

const PRODUCT_PAGES_PATH = path.join(process.cwd(), 'products', 'product_pages.json')

export type ProductPageData = {
  productId: string
  basicImageBase64: string
  productInfo: {
    brand: string
    category_1: string
    category_2: string
    category_3: string
    name_kr: string
    name_en: string
    volume: string
    msrp: number | null
  }
  publishedAt?: string
}

type ProductPagesStore = Record<string, ProductPageData>

function readStore(): ProductPagesStore {
  try {
    const data = JSON.parse(fs.readFileSync(PRODUCT_PAGES_PATH, 'utf-8'))
    return typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

function writeStore(store: ProductPagesStore): void {
  const dir = path.dirname(PRODUCT_PAGES_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(PRODUCT_PAGES_PATH, JSON.stringify(store, null, 2), 'utf-8')
}

export function getProductPage(productId: string): ProductPageData | null {
  const store = readStore()
  return store[productId] ?? null
}

export function getPublishedProductPages(): ProductPageData[] {
  const store = readStore()
  return Object.values(store).filter((p) => p.publishedAt)
}

export function saveProductPage(data: ProductPageData): void {
  const store = readStore()
  store[data.productId] = data
  writeStore(store)
}

export function publishProductPage(productId: string, data: Omit<ProductPageData, 'publishedAt'>): void {
  const store = readStore()
  store[productId] = {
    ...data,
    productId,
    publishedAt: new Date().toISOString(),
  }
  writeStore(store)
}

export function unpublishProductPage(productId: string): boolean {
  const store = readStore()
  const existing = store[productId]
  if (!existing) return false
  delete existing.publishedAt
  store[productId] = existing
  writeStore(store)
  return true
}
