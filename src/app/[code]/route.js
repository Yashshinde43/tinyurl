import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    const { initDatabase } = await import('@/lib/db');
    await initDatabase();
    dbInitialized = true;
  }
}

export async function GET(request, { params }) {
  try {
    await ensureDbInitialized();
    const resolvedParams = await params;
    const { code } = resolvedParams;

    console.log('Redirect request for code:', code);

    if (code === 'api' || code === 'code' || code === 'healthz') {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    const result = await query(
      'SELECT target_url FROM links WHERE code = $1',
      [code]
    );

    console.log('Query result for redirect:', result.rows.length, 'rows found');

    if (result.rows.length === 0) {
      console.log('Link not found for code:', code);
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const targetUrl = result.rows[0].target_url;
    console.log('Redirecting to:', targetUrl);

    await query(
      `UPDATE links 
       SET total_clicks = total_clicks + 1, 
           last_clicked = NOW()
       WHERE code = $1`,
      [code]
    );

    return NextResponse.redirect(targetUrl, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to redirect' },
      { status: 500 }
    );
  }
}

