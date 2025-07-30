require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pharmacieRoutes = require("./routes/pharmacieRoutes");
const produitRoutes = require("./routes/produitRoutes");
const commandeRoutes = require("./routes/commandeRoutes");
const utilisateurRoutes = require("./routes/utilisateurRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const pharmacienRoutes = require("./routes/pharmacienRoutes");
const gardeRoutes = require("./routes/gardeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/pharmacies", pharmacieRoutes);
app.use("/produits", produitRoutes);
app.use("/commandes", commandeRoutes);
app.use("/utilisateurs", utilisateurRoutes);
app.use("/categories", categorieRoutes);
app.use("/pharmaciens", pharmacienRoutes);
app.use("/gardes", gardeRoutes);
app.use("/admins", adminRoutes);

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, now: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API démarrée sur le port ${process.env.PORT}`);
});