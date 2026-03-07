import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'openapi.yaml')
  const yamlContent = fs.readFileSync(filePath, 'utf8')

  return new NextResponse(yamlContent, {
    headers: {
      'Content-Type': 'text/yaml',
      'Content-Disposition': 'attachment; filename="openapi.yaml"',
    },
  })
}
