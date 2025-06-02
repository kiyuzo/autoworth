import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');

  try {
    const client = await pool.connect();
    let result;

    switch (type) {
      case 'brands':
        result = await client.query('SELECT DISTINCT Brand as name FROM Car ORDER BY Brand');
        client.release();
        return NextResponse.json(
          result.rows.map((row, index) => ({
            id: index + 1,
            name: row.name
          }))
        );

      case 'models':
        if (!brand) {
          client.release();
          return NextResponse.json({ error: 'Brand is required for models' }, { status: 400 });
        }
        result = await client.query(
          'SELECT DISTINCT Model as name FROM Car WHERE Brand = $1 ORDER BY Model',
          [brand]
        );
        client.release();
        return NextResponse.json(
          result.rows.map((row, index) => ({
            id: index + 1,
            name: row.name,
            brand_name: brand
          }))
        );

      case 'trims':
        if (!brand || !model) {
          client.release();
          return NextResponse.json({ error: 'Brand and model are required for trims' }, { status: 400 });
        }
        result = await client.query(
          'SELECT DISTINCT Trim as name FROM Car WHERE Brand = $1 AND Model = $2 ORDER BY Trim',
          [brand, model]
        );
        client.release();
        return NextResponse.json(
          result.rows.map((row, index) => ({
            id: index + 1,
            name: row.name,
            brand_name: brand,
            model_name: model
          }))
        );

      default:
        client.release();
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}