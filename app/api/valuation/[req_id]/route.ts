import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: { req_id: string } }
) {
  const reqId = params.req_id;

  if (!reqId) {
    return NextResponse.json(
      { error: 'Request ID is required' },
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
        cv.created_at as request_date,
        c.Brand as brand,
        c.Model as model,
        c.Trim as trim,
        vr.val_id,
        vr.estimated_price,
        vr.created_at as valuation_date,
        u.name as user_name,
        u.email as user_email
      FROM car_valuation cv
      JOIN Car c ON cv.car_id = c.Car_ID
      JOIN valuation_result vr ON cv.req_id = vr.req_id
      JOIN users u ON cv.user_id = u.user_id
      WHERE cv.req_id = $1
    `, [reqId]);
    
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Valuation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valuation: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching valuation details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch valuation details' },
      { status: 500 }
    );
  }
}