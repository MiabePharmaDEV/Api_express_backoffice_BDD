const pool = require("../db");
const bcrypt = require("bcrypt");

// Récupérer tous les pharmaciens
exports.getPharmaciens = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ph.*, p.nom as nom_pharmacie
      FROM pharmaciens ph
      LEFT JOIN pharmacies p ON ph.id_pharmacie = p.id_pharmacie
      ORDER BY ph.id_pharmacien
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un pharmacien
exports.createPharmacien = async (req, res) => {
  const { id_pharmacie, nom_utilisateur, mot_de_passe } = req.body;
  try {
    // Vérifier l'unicité du nom_utilisateur
    const check = await pool.query(
      "SELECT id_pharmacien FROM pharmaciens WHERE nom_utilisateur = $1",
      [nom_utilisateur]
    );
    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Ce nom d'utilisateur existe déjà" });
    }
    // Hash du mot de passe
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      "INSERT INTO pharmaciens (id_pharmacie, nom_utilisateur, mot_de_passe) VALUES ($1, $2, $3) RETURNING *",
      [id_pharmacie, nom_utilisateur, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Afficher un pharmacien par son ID
exports.getPharmacienById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT ph.*, p.nom as nom_pharmacie FROM pharmaciens ph LEFT JOIN pharmacies p ON ph.id_pharmacie = p.id_pharmacie WHERE ph.id_pharmacien = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pharmacien non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier un pharmacien
exports.updatePharmacien = async (req, res) => {
  const { id } = req.params;
  const { id_pharmacie, nom_utilisateur, mot_de_passe } = req.body;
  try {
    let query, params;
    if (mot_de_passe) {
      const hash = await bcrypt.hash(mot_de_passe, 10);
      query =
        "UPDATE pharmaciens SET id_pharmacie = $1, nom_utilisateur = $2, mot_de_passe = $3 WHERE id_pharmacien = $4 RETURNING *";
      params = [id_pharmacie, nom_utilisateur, hash, id];
    } else {
      query =
        "UPDATE pharmaciens SET id_pharmacie = $1, nom_utilisateur = $2 WHERE id_pharmacien = $3 RETURNING *";
      params = [id_pharmacie, nom_utilisateur, id];
    }
    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pharmacien non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un pharmacien
exports.deletePharmacien = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM pharmaciens WHERE id_pharmacien = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pharmacien non trouvé" });
    }
    res.json({ message: "Pharmacien supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rechercher un pharmacien par nom_utilisateur
exports.getPharmacienByUsername = async (req, res) => {
  const { nom_utilisateur } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM pharmaciens WHERE nom_utilisateur = $1",
      [nom_utilisateur]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pharmacien non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Authentification pharmacien
exports.login = async (req, res) => {
  const { nom_utilisateur, mot_de_passe } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM pharmaciens WHERE nom_utilisateur = $1",
      [nom_utilisateur]
    );
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    }
    const pharmacien = result.rows[0];
    const match = await bcrypt.compare(mot_de_passe, pharmacien.mot_de_passe);
    if (!match) {
      return res
        .status(401)
        .json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    }
    res.json(pharmacien);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
