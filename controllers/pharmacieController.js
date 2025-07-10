const { Pool } = require("pg");
const pool = new Pool();

exports.getPharmacies = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pharmacies");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPharmacie = async (req, res) => {
  const { nom, emplacement, telephone1, telephone2, coordonnees } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO pharmacies (nom, emplacement, telephone1, telephone2, coordonnees) VALUES ($1, $2, $3, $4, ST_GeogFromText($5)) RETURNING *",
      [nom, emplacement, telephone1, telephone2, coordonnees]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Afficher une pharmacie par son ID
exports.getPharmacieById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        p.*,
        ST_X(p.coordonnees::geometry) AS longitude,
        ST_Y(p.coordonnees::geometry) AS latitude
      FROM pharmacies p
      WHERE p.id_pharmacie = $1
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pharmacie non trouvée" });
    }
    // On peut aussi retourner un objet coordonnees
    const pharmacie = result.rows[0];
    pharmacie.coordonnees = {
      longitude: pharmacie.longitude,
      latitude: pharmacie.latitude,
    };
    delete pharmacie.longitude;
    delete pharmacie.latitude;
    res.json(pharmacie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier une pharmacie
exports.updatePharmacie = async (req, res) => {
  const { id } = req.params;
  const { nom, emplacement, telephone1, telephone2, coordonnees } = req.body;
  try {
    const result = await pool.query(
      "UPDATE pharmacies SET nom = $1, emplacement = $2, telephone1 = $3, telephone2 = $4, coordonnees = ST_GeogFromText($5) WHERE id_pharmacie = $6 RETURNING *",
      [nom, emplacement, telephone1, telephone2, coordonnees, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pharmacie non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une pharmacie
exports.deletePharmacie = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM pharmacies WHERE id_pharmacie = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pharmacie non trouvée" });
    }
    res.json({ message: "Pharmacie supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
