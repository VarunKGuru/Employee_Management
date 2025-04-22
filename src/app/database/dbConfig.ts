import sql from 'mssql';

const dbConfig = {
    server: 'dn-gurumoorthy',
    user: 'sa',
    password: 'gps@123',
    database: 'Employee',
    options: {
        trustedConnection: true,
        trustServerCertificate: true, 
    },
  };

export async function getConnection() {
  try {
    const dbConnection = await sql.connect(dbConfig);
    return dbConnection;
  } catch (err) {
    throw new Error('DB connection failed: ' + err);
  }
}
