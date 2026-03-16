import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

const IMAGES_DIR = path.join(process.cwd(), 'products', 'images')

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

export async function GET(request: NextRequest) {
  try {
    const file = request.nextUrl.searchParams.get('file')
    if (!file || file.includes('..') || file.includes('/') || file.includes('\\')) {
      return new NextResponse('Invalid file', { status: 400 })
    }

    const filePath = path.join(IMAGES_DIR, file)
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const ext = path.extname(file).toLowerCase()
    const mime = MIME[ext] || 'application/octet-stream'
    const buf = fs.readFileSync(filePath)
    return new NextResponse(buf, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'no-cache, max-age=0',
      },
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
