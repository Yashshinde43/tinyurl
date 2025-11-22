import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Initialize database on first import
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    const { initDatabase } = await import('@/lib/db');
    await initDatabase();
    dbInitialized = true;
  }
}

// GET /api/links/:code - Get stats for one code
export async function GET(request, { params }) {
  try {
    await ensureDbInitialized();
    
    // In Next.js 15+, params might be a promise
    const resolvedParams = await params;
    const { code } = resolvedParams;
    
    console.log('Fetching stats for code:', code);
    
    const result = await query(
      `SELECT code, target_url, total_clicks, last_clicked, created_at 
       FROM links 
       WHERE code = $1`,
      [code]
    );
    
    console.log('Query result:', result.rows.length, 'rows found');
    
    if (result.rows.length === 0) {
      console.log('Link not found for code:', code);
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching link:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch link' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(request, { params }) {
  try {
    await ensureDbInitialized();
    
    // In Next.js 15+, params might be a promise
    const { code } = await params;
    
    const result = await query(
      'DELETE FROM links WHERE code = $1 RETURNING code',
      [code]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}

