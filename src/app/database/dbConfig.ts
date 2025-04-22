import sql from 'mssql';
console.log('DB_SERVER:', process.env.DB_SERVER);

const dbConfig = {
  server: process.env.DB_SERVER ?? '',
  user: process.env.DB_USER ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? '',
  options: {
    trustServerCertificate: true,
  }
};

export async function getConnection() {
  try {
    const dbConnection = await sql.connect(dbConfig);
    return dbConnection;
  } catch (err) {
    throw new Error('DB connection failed: ' + err);
  }
}
