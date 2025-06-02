import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const { firebaseUid, email, displayName } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: 'Firebase UID and email are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Check if user already exists by email
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        // Update existing user's name if it's different
        const updatedUser = await client.query(`
          UPDATE users 
          SET name = $2
          WHERE email = $1
          RETURNING *
        `, [email, displayName || email.split('@')[0]]);

        client.release();
        return NextResponse.json({
          message: 'User updated successfully',
          user: updatedUser.rows[0],
          isNewUser: false
        });
      } else {
        // Create new user
        const newUser = await client.query(`
          INSERT INTO users (name, email)
          VALUES ($1, $2)
          RETURNING *
        `, [displayName || email.split('@')[0], email]);

        client.release();
        return NextResponse.json({
          message: 'User created successfully',
          user: newUser.rows[0],
          isNewUser: true
        });
      }
    } catch (dbError) {
      client.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Error managing user:', error);
    return NextResponse.json(
      { error: 'Failed to manage user data' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}