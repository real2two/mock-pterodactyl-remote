import mysql from 'mysql2';

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export function query(query: string, values: string[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.query(
      query,
      values,
      (err, results) => {
        if (err) return reject(err);
        resolve(results as any[]);
      }
    );
  });
}

db.query(`CREATE TABLE IF NOT EXISTS servers (
  uuid VARCHAR(255),
  data TEXT,
  installation TEXT,

  PRIMARY KEY (uuid)
)`);
