import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get('modelId');

  if (!modelId) {
    return NextResponse.json({ error: 'Model ID is required' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM trims WHERE model_id = $1 ORDER BY name',
      [modelId]
    );
    client.release();
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch trims' }, { status: 500 });
  }
}