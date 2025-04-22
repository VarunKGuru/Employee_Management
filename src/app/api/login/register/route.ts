import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/app/database/dbConfig';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
  }

  try {
    const pool = await getConnection();

    // Check if user already exists
    const checkResult = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    if (checkResult.recordset.length > 0) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
    }

    // Insert new user
   await pool
      .request()
      .input('Username', sql.NVarChar, username)
      .input('Password', sql.NVarChar, password)
      .query('INSERT INTO Users (Username, Password) VALUES (@username, @password)');
      return NextResponse.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
