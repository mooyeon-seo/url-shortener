import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/config/db'
import Redis from 'ioredis'

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined in environment variables')
}
const redis = new Redis(process.env.REDIS_URL)

export async function POST(req: Request) {
  try {
    const { url }: { url: string } = await req.json()

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      )
    }

    // Generate short URL (6 characters)
    const shortId = crypto.randomBytes(3).toString('hex')

    // Save to Postgres with better error handling
    try {
      const savedUrl = await prisma.url.create({
        data: {
          shortUrl: shortId,
          longUrl: url,
        },
      })

      return NextResponse.json({
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${savedUrl.shortUrl}`,
        originalUrl: savedUrl.longUrl,
        status: 200,
      })
    } catch (dbError) {
      console.error(dbError)
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error creating short URL:', error)
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    )
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}