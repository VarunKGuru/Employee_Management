import { getConnection } from "@/app/database/dbConfig";
import sql from 'mssql';
import { NextResponse } from "next/server";
// // app/api/employeeList/route.ts
// const employees = [
//     { id: 1, name: "John Doe", email: "john@example.com", department: "HR" },
//     { id: 2, name: "Jane Smith", email: "jane@example.com", department: "Engineering" },
//   ];
  
  export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Employees');
        return Response.json(result.recordset);
      } catch {
        alert("Something went wrong while fetching employees.");
      }
  }
  
  export async function POST(req: Request) {
    const newEmployee = await req.json();
    const { name, email, department, phone } = newEmployee;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('Name', sql.NVarChar, name)
      .input('Email', sql.NVarChar, email)
      .input('Department', sql.NVarChar, department)
      .input('Phone', sql.NVarChar, phone)
      .query('INSERT INTO Employees (Name, Email, Department, Phone) VALUES (@Name, @Email, @Department, @Phone)');

    return NextResponse.json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json({ message: 'Failed to add employee' }, { status: 500 });
  }
  }
  
  export async function PUT(req: Request) {
    const updatedEmployee = await req.json();
    const { id, name, email, department, phone } = updatedEmployee;
  
    try {
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .input('Id', sql.Int, id)
        .input('Name', sql.NVarChar, name)
        .input('Email', sql.NVarChar, email)
        .input('Department', sql.NVarChar, department)
        .input('Phone', sql.NVarChar, phone)
        .query(`
          UPDATE Employees SET 
          Name = @Name, 
          Email = @Email, 
          Department = @Department, 
          Phone = @Phone
          WHERE Id = @Id
        `);
  
      if (result.rowsAffected[0] === 1) {
        return NextResponse.json({ message: 'Employee updated successfully' });
      } else {
        return new Response('Employee not found', { status: 404 });
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      return NextResponse.json({ message: 'Failed to update employee' }, { status: 500 });
    }
  }

  export async function DELETE(req: Request) {
    const { id } = await req.json();

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Employees WHERE Id = @Id');

    if (result.rowsAffected[0] === 1) {
      return NextResponse.json({ message: 'Employee deleted successfully' });
    } else {
      return new Response('Employee not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ message: 'Failed to delete employee' }, { status: 500 });
  }
  }
  
  