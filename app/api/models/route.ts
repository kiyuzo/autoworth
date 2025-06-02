import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');

  if (!brandId) {
    return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM models WHERE brand_id = $1 ORDER BY name',
      [brandId]
    );
    client.release();
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}