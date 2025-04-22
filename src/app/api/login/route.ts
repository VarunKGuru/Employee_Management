import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getConnection } from '@/app/database/dbConfig';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM Users WHERE Username = @username AND Password = @password');

    if (result.recordset.length === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Login error' }, { status: 500 });
  }
}
