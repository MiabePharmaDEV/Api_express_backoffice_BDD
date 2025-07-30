const pool = require("../db");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    res.json({ message: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};