/**
 * products/products 폴더의 엑셀 파일들을 분석하여 products/productslist_db.csv 생성
 * 사용법: npm run update-products
 */
const path = require('path')
const fs = require('fs')
const XLSX = require('xlsx')

const PRODUCTS_DIR = path.join(process.cwd(), 'products', 'products')
const DB_PATH = path.join(process.cwd(), 'products', 'productslist_db.csv')

function parseRow(row) {
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
    quantity_per_carton: row.quantity_per_carton != null ? parseFloat(row.quantity_per_carton) : undefined,
    shelf_life_month: row.shelf_life_month != null ? parseFloat(row.shelf_life_month) : undefined,
    msrp: row.msrp != null ? parseFloat(String(row.msrp).replace(/[^0-9.-]/g, '')) : undefined,
    'buying_price_-vat': row['buying_price_-vat'] != null ? parseFloat(row['buying_price_-vat']) : undefined,
    'buying_price_+vat': row['buying_price_+vat'] != null ? parseFloat(row['buying_price_+vat']) : undefined,
    buying_price_rate: row.buying_price_rate != null ? parseFloat(row.buying_price_rate) : undefined,
    product_barcode: row.product_barcode != null ? String(row.product_barcode) : undefined,
    carton_barcode: row.carton_barcode != null ? String(row.carton_barcode) : undefined,
    country_of_origin: String(row.country_of_origin ?? '').trim() || undefined,
  }
}

function escapeCsv(val) {
  if (val == null) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

const headers = [
  'brand', 'image', 'category_1', 'category_2', 'category_3',
  'name_kr', 'name_en', 'name_cn_s', 'name_cn_f', 'name_jp',
  'volume', 'quantity_per_carton', 'shelf_life_month', 'msrp',
  'buying_price_-vat', 'buying_price_+vat', 'buying_price_rate',
  'product_barcode', 'carton_barcode', 'country_of_origin',
]

const all = []

if (!fs.existsSync(PRODUCTS_DIR)) {
  console.error('products/products 폴더가 없습니다.')
  process.exit(1)
}

const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith('.xlsx') || f.endsWith('.xls'))

for (const file of files) {
  const filePath = path.join(PRODUCTS_DIR, file)
  try {
    const buf = fs.readFileSync(filePath)
    const wb = XLSX.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)
    for (const row of rows) {
      const parsed = parseRow(row)
      if (parsed) all.push(parsed)
    }
    console.log(`${file}: ${rows.length}행 처리`)
  } catch (err) {
    console.error(`${file} 읽기 실패:`, err.message)
  }
}

if (all.length === 0) {
  console.error('처리된 상품이 없습니다.')
  process.exit(1)
}

const dir = path.dirname(DB_PATH)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const lines = [headers.join(',')]
for (const p of all) {
  const row = headers.map((h) => escapeCsv(p[h]))
  lines.push(row.join(','))
}
fs.writeFileSync(DB_PATH, lines.join('\n'), 'utf-8')

console.log(`\n완료: ${all.length}건 -> ${DB_PATH}`)
