import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = searchParams.get('limit') || '10';

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        cv.req_id,
        cv.year,
        cv.mileage,
        vr.created_at as request_date,
        vr.created_at as valuation_date,
        c.Brand as brand,
        c.Model as model,
        c.Trim as trim,
        vr.estimated_price,
        u.name as user_name
      FROM car_valuation cv
      JOIN Car c ON cv.car_id = c.Car_ID
      JOIN valuation_result vr ON cv.req_id = vr.req_id
      JOIN users u ON cv.user_id = u.user_id
      WHERE cv.user_id = $1
      ORDER BY vr.created_at DESC
      LIMIT $2
    `, [userId, limit]);
    
    client.release();

    return NextResponse.json({
      history: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching valuation history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch valuation history' },
      { status: 500 }
    );
  }
}