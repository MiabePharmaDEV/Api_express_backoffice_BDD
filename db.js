require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test de connexion à la base de données
pool
  .connect()
  .then((client) => {
    console.log("✅ Connexion à PostgreSQL réussie !");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à PostgreSQL :", err.message);
  });

module.exports = pool;
