/* Apply schema.sql. Idempotent — every statement is create-if-not-exists, so
   running it twice is safe and running it on a live database changes nothing. */
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false },
})

;(async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  try {
    await pool.query(sql)
    console.log('schema applied')
  } catch (err) {
    console.error('migration failed:', err.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
})()
