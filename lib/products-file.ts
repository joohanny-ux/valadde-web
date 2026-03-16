import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

export type ProductRow = {
  brand: string
  image: string
  category_1: string
  category_2: string
  category_3: string
  name_kr: string
  name_en: string
  name_cn_s?: string
  name_cn_f?: string
  name_jp?: string
  volume?: string
  quantity_per_carton?: number
  shelf_life_month?: number
  msrp?: number
  'buying_price_-vat'?: number
  'buying_price_+vat'?: number
  buying_price_rate?: number
  product_barcode?: string
  carton_barcode?: string
  country_of_origin?: string
  _sourceFile?: string
  _rowIndex?: number
}

export type ProductWithMeta = ProductRow & {
  id: string
  is_display?: boolean
  source?: 'file' | 'manual'
  createdAt?: string
}

const PRODUCTS_DIR = path.join(process.cwd(), 'products', 'products')
const DB_PATH = path.join(process.cwd(), 'products', 'productslist_db.csv')
const REGISTERED_PATH = path.join(process.cwd(), 'products', 'products_registered.json')

function slugId(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function genId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

const EXPECTED_HEADERS = [
  'brand', 'image', 'category_1', 'category_2', 'category_3',
  'name_kr', 'name_en', 'name_cn_s', 'name_cn_f', 'name_jp',
  'volume', 'quantity_per_carton', 'shelf_life_month', 'msrp',
  'buying_price_-vat', 'buying_price_+vat', 'buying_price_rate',
  'product_barcode', 'carton_barcode', 'country_of_origin',
]

function parseRow(row: Record<string, unknown>): ProductRow | null {
  const brand = String(row.brand ?? '').trim()
  const nameKr = String(row.name_kr ?? '').trim()
  if (!brand || !nameKr) return null

  return {
    brand,
    image: String(row.image ?? '').trim(),
    category_1: String(row.category_1 ?? '').trim(),
    category_2: String(row.category_2 ?? '').trim(),
    category_3: String(row.category_3 ?? '').trim(),
    name_kr: nameKr,
    name_en: String(row.name_en ?? '').trim(),
    name_cn_s: String(row.name_cn_s ?? '').trim() || undefined,
    name_cn_f: String(row.name_cn_f ?? '').trim() || undefined,
    name_jp: String(row.name_jp ?? '').trim() || undefined,
    volume: String(row.volume ?? '').trim() || undefined,
    quantity_per_carton: typeof row.quantity_per_carton === 'number'
      ? row.quantity_per_carton
      : typeof row.quantity_per_carton === 'string'
        ? parseFloat(row.quantity_per_carton) || undefined
        : undefined,
    shelf_life_month: typeof row.shelf_life_month === 'number'
      ? row.shelf_life_month
      : typeof row.shelf_life_month === 'string'
        ? parseFloat(row.shelf_life_month) || undefined
        : undefined,
    msrp: typeof row.msrp === 'number'
      ? row.msrp
      : typeof row.msrp === 'string'
        ? parseFloat(String(row.msrp).replace(/[^0-9.-]/g, '')) || undefined
        : row.msrp != null
          ? parseFloat(String(row.msrp)) || undefined
          : undefined,
    'buying_price_-vat': typeof row['buying_price_-vat'] === 'number'
      ? row['buying_price_-vat']
      : row['buying_price_-vat'] != null
        ? parseFloat(String(row['buying_price_-vat'])) || undefined
        : undefined,
    'buying_price_+vat': typeof row['buying_price_+vat'] === 'number'
      ? row['buying_price_+vat']
      : row['buying_price_+vat'] != null
        ? parseFloat(String(row['buying_price_+vat'])) || undefined
        : undefined,
    buying_price_rate: typeof row.buying_price_rate === 'number'
      ? row.buying_price_rate
      : row.buying_price_rate != null
        ? parseFloat(String(row.buying_price_rate)) || undefined
        : undefined,
    product_barcode: row.product_barcode != null ? String(row.product_barcode) : undefined,
    carton_barcode: row.carton_barcode != null ? String(row.carton_barcode) : undefined,
    country_of_origin: String(row.country_of_origin ?? '').trim() || undefined,
  }
}

export function readProductsFromFolder(): ProductRow[] {
  const all: ProductRow[] = []
  if (!fs.existsSync(PRODUCTS_DIR)) return all

  const files = fs.readdirSync(PRODUCTS_DIR).filter(
    (f) => f.endsWith('.xlsx') || f.endsWith('.xls')
  )

  for (const file of files) {
    const filePath = path.join(PRODUCTS_DIR, file)
    try {
      const buf = fs.readFileSync(filePath)
      const wb = XLSX.read(buf, { type: 'buffer' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const parsed = parseRow(row)
        if (parsed) {
          parsed._sourceFile = file
          parsed._rowIndex = i + 2
          all.push(parsed)
        }
      }
    } catch (err) {
      console.error(`Error reading ${file}:`, err)
    }
  }

  return all
}

export function readProductsFromDb(): ProductRow[] {
  if (!fs.existsSync(DB_PATH)) return []

  const content = fs.readFileSync(DB_PATH, 'utf-8')
  const lines = content.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const rows: ProductRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row: Record<string, string | number | undefined> = {}
    headers.forEach((h, j) => {
      const v = values[j]
      if (v !== undefined) {
        const num = parseFloat(v)
        row[h] = isNaN(num) || v !== String(num) ? v : num
      }
    })
    const parsed = parseRow(row as Record<string, unknown>)
    if (parsed) rows.push(parsed)
  }

  return rows
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if (inQuotes) {
      current += c
    } else if (c === ',') {
      result.push(current.trim())
      current = ''
    } else {
      current += c
    }
  }
  result.push(current.trim())
  return result
}

function escapeCsv(val: string | number | undefined): string {
  if (val == null) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function writeProductsToDb(products: ProductRow[]): void {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const headers = EXPECTED_HEADERS
  const lines = [headers.join(',')]
  for (const p of products) {
    const row = headers.map((h) => escapeCsv((p as Record<string, unknown>)[h] as string | number | undefined))
    lines.push(row.join(','))
  }
  fs.writeFileSync(DB_PATH, lines.join('\n'), 'utf-8')
}

export function updateProductsDb(): { count: number; written: boolean; message?: string; products: ProductRow[] } {
  const products = readProductsFromFolder()
  if (products.length === 0) {
    return { count: 0, written: false, message: 'products/products 폴더에 엑셀 파일이 없습니다.', products }
  }

  try {
    writeProductsToDb(products)
    return { count: products.length, written: true, products }
  } catch (err) {
    const msg = err instanceof Error ? err.message : '파일 저장 실패'
    return { count: products.length, written: false, message: msg, products }
  }
}

export function getProductsForList(options?: { q?: string; brand?: string }): ProductRow[] {
  let products = readProductsFromDb()
  if (products.length === 0) {
    products = readProductsFromFolder()
    if (products.length > 0) {
      try {
        writeProductsToDb(products)
      } catch {
        // ignore write failure (e.g. on Vercel)
      }
    }
  }

  if (options?.q) {
    const q = options.q.toLowerCase().trim()
    products = products.filter(
      (p) =>
        p.name_kr.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.product_barcode && String(p.product_barcode).includes(q))
    )
  }
  if (options?.brand) {
    products = products.filter((p) => p.brand.toLowerCase() === options.brand!.toLowerCase())
  }

  return products
}

// --- products_registered.json (CRUD for 상품 등록) ---

type RegisteredData = { products: ProductWithMeta[]; excludedKeys?: string[] }

function readRegistered(): RegisteredData {
  if (!fs.existsSync(REGISTERED_PATH)) return { products: [] }
  try {
    const data = JSON.parse(fs.readFileSync(REGISTERED_PATH, 'utf-8'))
    return {
      products: Array.isArray(data.products) ? data.products : [],
      excludedKeys: Array.isArray(data.excludedKeys) ? data.excludedKeys : data.excludedIds || [],
    }
  } catch {
    return { products: [] }
  }
}

function writeRegistered(data: RegisteredData): void {
  const dir = path.dirname(REGISTERED_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(REGISTERED_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export function getAllProductsWithMeta(options?: { q?: string; brand?: string }): ProductWithMeta[] {
  let fileProducts = readProductsFromDb()
  if (fileProducts.length === 0) {
    const fromFolder = readProductsFromFolder()
    if (fromFolder.length > 0) {
      try {
        writeProductsToDb(fromFolder)
      } catch { /* ignore */ }
      fileProducts = fromFolder
    }
  }

  const { products: registered, excludedKeys = [] } = readRegistered()
  const excludedSet = new Set(excludedKeys)
  const regByKey = new Map<string, ProductWithMeta>()
  const regById = new Map<string, ProductWithMeta>()
  for (const p of registered) {
    if (p.source === 'manual') continue
    regByKey.set(`${p.brand}|${p.name_kr}`, p)
    if (p.id?.startsWith('file_')) regById.set(p.id, p)
  }

  const merged: ProductWithMeta[] = []
  let fileIdx = 0
  for (const p of fileProducts) {
    const key = `${p.brand}|${p.name_kr}`
    if (excludedSet.has(key)) continue
    const id = `file_${fileIdx++}`
    const reg = regById.get(id) ?? regByKey.get(key)
    if (reg && (reg.id === id || reg.id?.startsWith('file_'))) {
      merged.push({ ...p, ...reg, id: reg.id, source: 'file' })
    } else {
      merged.push({ ...p, id, is_display: true, source: 'file' })
    }
  }

  for (const p of registered) {
    if (p.source === 'manual' && !merged.some((m) => m.id === p.id)) {
      merged.push({ ...p, source: 'manual' })
    }
  }

  let result = merged
  if (options?.q) {
    const q = options.q.toLowerCase().trim()
    result = result.filter(
      (p) =>
        p.name_kr.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.product_barcode && String(p.product_barcode).includes(q))
    )
  }
  if (options?.brand) {
    result = result.filter((p) => p.brand.toLowerCase() === options.brand!.toLowerCase())
  }

  return result
}

export function addProduct(data: ProductRow & { is_display?: boolean }): ProductWithMeta {
  const { products } = readRegistered()
  const id = genId()
  const product: ProductWithMeta = {
    ...data,
    id,
    is_display: data.is_display ?? true,
    source: 'manual',
    createdAt: new Date().toISOString(),
  }
  products.push(product)
  writeRegistered({ products })
  return product
}

export function updateProduct(id: string, data: Partial<ProductRow> & { is_display?: boolean }): ProductWithMeta | null {
  const { products, excludedKeys = [] } = readRegistered()
  const idx = products.findIndex((p) => p.id === id)
  if (idx >= 0) {
    products[idx] = { ...products[idx], ...data, id }
    writeRegistered({ products, excludedKeys })
    return products[idx]
  }
  const all = getAllProductsWithMeta()
  const prod = all.find((x) => x.id === id)
  if (!prod) return null
  const updated: ProductWithMeta = { ...prod, ...data, id, source: prod.source ?? 'file' }
  products.push(updated)
  writeRegistered({ products, excludedKeys })
  return updated
}

export function deleteProduct(id: string): boolean {
  const { products, excludedKeys = [] } = readRegistered()
  if (id.startsWith('file_')) {
    const all = getAllProductsWithMeta()
    const prod = all.find((x) => x.id === id)
    if (!prod) return false
    const key = `${prod.brand}|${prod.name_kr}`
    if (excludedKeys.includes(key)) return true
    writeRegistered({ products, excludedKeys: [...excludedKeys, key] })
    return true
  }
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length === products.length) return false
  writeRegistered({ products: filtered, excludedKeys })
  return true
}

export function setProductDisplay(id: string, is_display: boolean): ProductWithMeta | null {
  const { products, excludedKeys = [] } = readRegistered()
  const p = products.find((x) => x.id === id)
  if (!p) {
    const all = getAllProductsWithMeta()
    const prod = all.find((x) => x.id === id)
    if (!prod) return null
    const newProd: ProductWithMeta = { ...prod, id, is_display, source: prod.source ?? 'file' }
    products.push(newProd)
    writeRegistered({ products, excludedKeys })
    return newProd
  }
  p.is_display = is_display
  writeRegistered({ products, excludedKeys })
  return p
}
