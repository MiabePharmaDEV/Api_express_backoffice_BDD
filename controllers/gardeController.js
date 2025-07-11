const pool = require("../db");

// Récupérer toutes les gardes
exports.getGardes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gardes ORDER BY debut_garde DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une garde
exports.createGarde = async (req, res) => {
  const { debut_garde, fin_garde, pharmacies_garde, isactive } = req.body;
  try {
    let pharmaciesJson = pharmacies_garde;
    if (typeof pharmacies_garde !== "string") {
      pharmaciesJson = JSON.stringify(pharmacies_garde || []);
    }
    const result = await pool.query(
      "INSERT INTO gardes (debut_garde, fin_garde, pharmacies_garde, isactive) VALUES ($1, $2, $3, $4) RETURNING *",
      [debut_garde, fin_garde, pharmaciesJson, isactive || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Afficher une garde par son ID
exports.getGardeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM gardes WHERE id_garde = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Garde non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier une garde
exports.updateGarde = async (req, res) => {
  const { id } = req.params;
  const { debut_garde, fin_garde, pharmacies_garde, isactive } = req.body;
  try {
    let pharmaciesJson = pharmacies_garde;
    if (typeof pharmacies_garde !== "string") {
      pharmaciesJson = JSON.stringify(pharmacies_garde || []);
    }
    const result = await pool.query(
      "UPDATE gardes SET debut_garde = $1, fin_garde = $2, pharmacies_garde = $3, isactive = $4 WHERE id_garde = $5 RETURNING *",
      [debut_garde, fin_garde, pharmaciesJson, isactive, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Garde non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une garde
exports.deleteGarde = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM gardes WHERE id_garde = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Garde non trouvée" });
    }
    res.json({ message: "Garde supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les gardes actives
exports.getGardesActives = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gardes WHERE isactive = true ORDER BY debut_garde DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les gardes d'une pharmacie (id dans le tableau pharmacies_garde)
exports.getGardesByPharmacie = async (req, res) => {
  const { id_pharmacie } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM gardes WHERE pharmacies_garde @> $1::jsonb ORDER BY debut_garde DESC",
      [JSON.stringify([parseInt(id_pharmacie)])]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer la liste des pharmacies (ID + nom)
exports.getPharmaciesList = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_pharmacie, nom FROM pharmacies ORDER BY nom"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
