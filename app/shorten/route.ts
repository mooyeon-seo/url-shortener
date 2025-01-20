import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'

const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://url.insufficient.ca'

function generateShortUrl(longUrl: string): string {
  const hash = crypto.createHash('sha256').update(longUrl).digest('base64url').slice(0, 10);
  return hash;
}


export async function POST(req: Request) {
  try {
    const { url: longUrl }: { url: string } = await req.json()

    // Validate URL
    if (!longUrl || !isValidUrl(longUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      )
    }

    // Step 0: Check if the URL starts with the application URL (prevent infinite redirection)
    if (longUrl.startsWith(appBaseUrl)) {
      return NextResponse.json({ error: "This URL is part of the application and cannot be shortened." }, { status: 400 });
    }

    // Step 1: Check Redis first
    const existingShortUrl = await redis.get(longUrl);
    if (existingShortUrl) {
      // If the long URL already has a shortened version in Redis, return it
      return NextResponse.json({ shortUrl: `${appBaseUrl}/${existingShortUrl}` });
    }

    // Step 2: Check the PostgreSQL database for an existing mapping
    const existingUrlMapping = await prisma.url.findUnique({
      where: {
        longUrl: longUrl,
      },
    });

    if (existingUrlMapping) {
      // If URL already has a shortened version in the database, store it in Redis and return it
      await redis.set(longUrl, existingUrlMapping.shortUrl, 'EX', 3600); // Cache it in Redis for fast lookups
      return NextResponse.json({ shortUrl: `${appBaseUrl}/${existingUrlMapping.shortUrl}` });
    }


    // Generate short URL (6 characters)
    const shortUrl = generateShortUrl(longUrl);

    // Save to Postgres with better error handling
    try {
      const savedUrl = await prisma.url.create({
        data: {
          shortUrl,
          longUrl,
        },
      })

      await redis.set(shortUrl, longUrl, 'EX', 3600);
      await redis.set(longUrl, shortUrl, 'EX', 3600);

      return NextResponse.json({
        shortUrl: `${appBaseUrl}/${savedUrl.shortUrl}`,
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