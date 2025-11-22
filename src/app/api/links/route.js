import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateCode, validateCode, validateUrl } from '@/lib/utils';

let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    const { initDatabase } = await import('@/lib/db');
    await initDatabase();
    dbInitialized = true;
  }
}

export async function GET(request) {
  try {
    await ensureDbInitialized();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let result;
    if (search) {
      result = await query(
        `SELECT code, target_url, total_clicks, last_clicked, created_at 
         FROM links 
         WHERE code ILIKE $1 OR target_url ILIKE $1 
         ORDER BY created_at DESC`,
        [`%${search}%`]
      );
    } else {
      result = await query(
        `SELECT code, target_url, total_clicks, last_clicked, created_at 
         FROM links 
         ORDER BY created_at DESC`
      );
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await ensureDbInitialized();

    const body = await request.json();
    const { target_url, code: customCode } = body;

    console.log('Creating link with:', { target_url, customCode });

    if (!target_url || !validateUrl(target_url)) {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    let code = customCode;
    if (code) {
      if (!validateCode(code)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
    } else {
      let attempts = 0;
      do {
        code = generateCode(6);
        const existing = await query('SELECT code FROM links WHERE code = $1', [code]);
        if (existing.rows.length === 0) break;
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { error: 'Failed to generate unique code' },
            { status: 500 }
          );
        }
      } while (true);
    }

    // Check if code already exists
    const existing = await query('SELECT code FROM links WHERE code = $1', [code]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      );
    }

    const result = await query(
      `INSERT INTO links (code, target_url) 
       VALUES ($1, $2) 
       RETURNING code, target_url, total_clicks, last_clicked, created_at`,
      [code, target_url]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      );
    }

    const errorMessage = error.message || 'Failed to create link';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

