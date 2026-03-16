import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { getAllProductsWithMeta } from '@/lib/products-file'

const PRODUCED_DIR = path.join(process.cwd(), 'products', 'images', 'produced')

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const all = getAllProductsWithMeta()
    const product = all.find((p) => p.id === id)
    if (!product) return NextResponse.json({ message: '상품 없음' }, { status: 404 })
    const brand = (product.brand ?? '').trim()
    const nameEn = (product.name_en ?? '').trim()
    const filename = `${brand}_${nameEn}_basic.png`.replace(/[<>:"/\\|?*]/g, '_')
    if (!filename || filename === '_basic.png') return NextResponse.json({ imageBase64: null })
    const filePath = path.join(PRODUCED_DIR, filename)
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return NextResponse.json({ imageBase64: null })
    const buf = fs.readFileSync(filePath)
    return NextResponse.json({ imageBase64: buf.toString('base64') })
  } catch (err) {
    return NextResponse.json({ imageBase64: null })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const all = getAllProductsWithMeta()
    const product = all.find((p) => p.id === id)
    if (!product) return NextResponse.json({ message: '상품 없음' }, { status: 404 })
    const brand = (product.brand ?? '').trim()
    const nameEn = (product.name_en ?? '').trim()
    const filename = `${brand}_${nameEn}_basic.png`.replace(/[<>:"/\\|?*]/g, '_')
    if (!filename || filename === '_basic.png') return NextResponse.json({ message: '파일명을 생성할 수 없습니다.' }, { status: 400 })
    const filePath = path.join(PRODUCED_DIR, filename)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) fs.unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : '실패' }, { status: 500 })
  }
}
