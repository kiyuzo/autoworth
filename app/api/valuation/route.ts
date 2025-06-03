import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// POST - Create new car valuation request
export async function POST(request: Request) {
  try {
    const { userId, brand, model, trim, year, mileage, estimatedPrice } = await request.json();

    console.log('Received valuation data:', { userId, brand, model, trim, year, mileage, estimatedPrice });

    // Updated validation to properly handle 0 values
    if (!userId || !brand || !model || !trim || year == null || mileage == null || !estimatedPrice) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Additional validation for numeric fields
    if (typeof year !== 'number' || typeof mileage !== 'number' || typeof estimatedPrice !== 'number') {
      return NextResponse.json(
        { error: 'Year, mileage, and estimated price must be numbers' },
        { status: 400 }
      );
    }

    if (mileage < 0) {
      return NextResponse.json(
        { error: 'Mileage cannot be negative' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      // First, find the car_id from the Car table (case-insensitive search)
      const carResult = await client.query(
        'SELECT Car_ID FROM Car WHERE LOWER(Brand) = LOWER($1) AND LOWER(Model) = LOWER($2) AND LOWER(Trim) = LOWER($3)',
        [brand, model, trim]
      );

      if (carResult.rows.length === 0) {
        // If car not found, insert it
        console.log('Car not found, inserting new car:', { brand, model, trim });
        const insertCarResult = await client.query(
          'INSERT INTO Car (Brand, Model, Trim) VALUES ($1, $2, $3) RETURNING Car_ID',
          [brand, model, trim]
        );
        var carId = insertCarResult.rows[0].car_id;
      } else {
        var carId = carResult.rows[0].car_id;
      }

      console.log('Using Car_ID:', carId);

      // Get the next req_id manually
      const nextReqIdResult = await client.query(`
        SELECT COALESCE(MAX(req_id), 0) + 1 as next_req_id FROM car_valuation
      `);
      const nextReqId = nextReqIdResult.rows[0].next_req_id;

      console.log('Using next req_id:', nextReqId);

      // Insert into car_valuation table with explicit req_id
      const valuationResult = await client.query(`
        INSERT INTO car_valuation (req_id, user_id, car_id, year, mileage)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING req_id
      `, [nextReqId, userId, carId, year, mileage]);

      const reqId = valuationResult.rows[0].req_id;

      console.log('Inserted valuation with req_id:', reqId);

      // Get the next val_id manually
      const nextValIdResult = await client.query(`
        SELECT COALESCE(MAX(val_id), 0) + 1 as next_val_id FROM valuation_result
      `);
      const nextValId = nextValIdResult.rows[0].next_val_id;

      console.log('Using next val_id:', nextValId);

      // Insert into valuation_result table with explicit val_id
      const resultInsert = await client.query(`
        INSERT INTO valuation_result (val_id, req_id, estimated_price, created_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING val_id, created_at
      `, [nextValId, reqId, estimatedPrice]);

      const valId = resultInsert.rows[0].val_id;
      const createdAt = resultInsert.rows[0].created_at;

      console.log('Inserted result with val_id:', valId);

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
          estimated_price: estimatedPrice,
          created_at: createdAt
        }
      });

    } catch (dbError) {
      await client.query('ROLLBACK');
      client.release();
      console.error('Database error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error saving valuation:', error);
    return NextResponse.json(
      { error: 'Failed to save valuation data', details: error.message },
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
        c.Brand as brand,
        c.Model as model,
        c.Trim as trim,
        vr.estimated_price,
        vr.created_at
      FROM car_valuation cv
      JOIN Car c ON cv.car_id = c.Car_ID
      JOIN valuation_result vr ON cv.req_id = vr.req_id
      WHERE cv.user_id = $1
      ORDER BY vr.created_at DESC
    `, [userId]);
    
    client.release();

    console.log(`Found ${result.rows.length} valuations for user ${userId}`);

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