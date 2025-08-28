import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "lumina_user",
  host: process.env.DB_HOST || "postgres",
  database: process.env.DB_NAME || "lumina",
  password: process.env.DB_PASSWORD || "lumina_password",
  port: process.env.DB_PORT || 5432,

  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  statement_timeout: 30000,
  query_timeout: 30000,
});

pool.on("connect", () => {
  console.log("Established new connection to the database ✅");
});

pool.on("acquire", () => {
  console.log("Acquired a connection from the pool  ✅");
});

pool.on("release", () => {
  console.log("Released a connection to the pool ✅");
});

pool.on("error", (error) => {
  console.log("Error in the database connection ❌", error);
});

pool.on("remove", () => {
  console.log("Removed a connection from the pool 🗑️");
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("Test connection successful ✅");
    console.log("🕑 Current date and time:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("❌ Test connection failed", error);
    return false;
  }
};

export const closePool = async () => {
  try {
    await pool.end();
    console.log("Database pool closed successfully 🔒");
  } catch (error) {
    console.error("❌ Error closing database pool", error);
  }
};

export default pool;
