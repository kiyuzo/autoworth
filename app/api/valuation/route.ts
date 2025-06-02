import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// POST - Create new car valuation request
export async function POST(request: Request) {
  try {
    const { userId, brand, model, trim, year, mileage, estimatedPrice } = await request.json();

    if (!userId || !brand || !model || !trim || !year || !mileage || !estimatedPrice) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      // First, find the car_id from the Car table
      const carResult = await client.query(
        'SELECT Car_ID FROM Car WHERE Brand = $1 AND Model = $2 AND Trim = $3',
        [brand, model, trim]
      );

      if (carResult.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { error: 'Car not found in database' },
          { status: 404 }
        );
      }

      const carId = carResult.rows[0].car_id;

      // Insert into car_valuation table
      const valuationResult = await client.query(`
        INSERT INTO car_valuation (user_id, car_id, year, mileage)
        VALUES ($1, $2, $3, $4)
        RETURNING req_id
      `, [userId, carId, year, mileage]);

      const reqId = valuationResult.rows[0].req_id;

      // Insert into valuation_result table with timestamp
      const resultInsert = await client.query(`
        INSERT INTO valuation_result (req_id, estimated_price, created_at)
        VALUES ($1, $2, NOW())
        RETURNING val_id
      `, [reqId, estimatedPrice]);

      const valId = resultInsert.rows[0].val_id;

      // Commit transaction
      await client.query('COMMIT');
      client.release();

      return NextResponse.json({
        message: 'Valuation saved successfully',
        data: {
          req_id: reqId,
          val_id: valId,
          user_id: userId,
          car_id: carId,
          year,
          mileage,
          estimated_price: estimatedPrice
        }
      });

    } catch (dbError) {
      await client.query('ROLLBACK');
      client.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Error saving valuation:', error);
    return NextResponse.json(
      { error: 'Failed to save valuation data' },
      { status: 500 }
    );
  }
}

// GET - Retrieve user's valuation history
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

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
        c.Brand,
        c.Model,
        c.Trim,
        vr.estimated_price,
        vr.created_at
      FROM car_valuation cv
      JOIN Car c ON cv.car_id = c.Car_ID
      JOIN valuation_result vr ON cv.req_id = vr.req_id
      WHERE cv.user_id = $1
      ORDER BY vr.created_at DESC
    `, [userId]);
    
    client.release();

    return NextResponse.json({
      valuations: result.rows
    });
  } catch (error) {
    console.error('Error fetching valuation history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch valuation history' },
      { status: 500 }
    );
  }
}