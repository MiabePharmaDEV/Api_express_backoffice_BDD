const { Pool } = require("pg");
const pool = new Pool();

// Récupérer tous les utilisateurs
exports.getUtilisateurs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id_utilisateur,
        nom,
        prenoms,
        ST_AsText(adresse_courant) as adresse_courant,
        telephone,
        email
      FROM utilisateurs
      ORDER BY nom, prenoms
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un utilisateur
exports.createUtilisateur = async (req, res) => {
  const { nom, prenoms, adresse_courant, telephone, email, mot_de_passe } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO utilisateurs (nom, prenoms, adresse_courant, telephone, email, mot_de_passe) VALUES ($1, $2, ST_GeogFromText($3), $4, $5, $6) RETURNING id_utilisateur, nom, prenoms, ST_AsText(adresse_courant) as adresse_courant, telephone, email",
      [nom, prenoms, adresse_courant, telephone, email, mot_de_passe]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Afficher un utilisateur par son ID
exports.getUtilisateurById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        id_utilisateur,
        nom,
        prenoms,
        ST_AsText(adresse_courant) as adresse_courant,
        telephone,
        email
      FROM utilisateurs 
      WHERE id_utilisateur = $1
    `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier un utilisateur
exports.updateUtilisateur = async (req, res) => {
  const { id } = req.params;
  const { nom, prenoms, adresse_courant, telephone, email, mot_de_passe } =
    req.body;
  try {
    let query, params;

    if (mot_de_passe) {
      // Si le mot de passe est fourni, l'inclure dans la mise à jour
      query =
        "UPDATE utilisateurs SET nom = $1, prenoms = $2, adresse_courant = ST_GeogFromText($3), telephone = $4, email = $5, mot_de_passe = $6 WHERE id_utilisateur = $7 RETURNING id_utilisateur, nom, prenoms, ST_AsText(adresse_courant) as adresse_courant, telephone, email";
      params = [
        nom,
        prenoms,
        adresse_courant,
        telephone,
        email,
        mot_de_passe,
        id,
      ];
    } else {
      // Sinon, ne pas modifier le mot de passe
      query =
        "UPDATE utilisateurs SET nom = $1, prenoms = $2, adresse_courant = ST_GeogFromText($3), telephone = $4, email = $5 WHERE id_utilisateur = $6 RETURNING id_utilisateur, nom, prenoms, ST_AsText(adresse_courant) as adresse_courant, telephone, email";
      params = [nom, prenoms, adresse_courant, telephone, email, id];
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un utilisateur
exports.deleteUtilisateur = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM utilisateurs WHERE id_utilisateur = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rechercher un utilisateur par email
exports.getUtilisateurByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        id_utilisateur,
        nom,
        prenoms,
        ST_AsText(adresse_courant) as adresse_courant,
        telephone,
        email
      FROM utilisateurs 
      WHERE email = $1
    `,
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rechercher un utilisateur par téléphone
exports.getUtilisateurByTelephone = async (req, res) => {
  const { telephone } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        id_utilisateur,
        nom,
        prenoms,
        ST_AsText(adresse_courant) as adresse_courant,
        telephone,
        email
      FROM utilisateurs 
      WHERE telephone = $1
    `,
      [telephone]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Authentification utilisateur
exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const result = await pool.query(
      `
      SELECT 
        id_utilisateur,
        nom,
        prenoms,
        ST_AsText(adresse_courant) as adresse_courant,
        telephone,
        email
      FROM utilisateurs 
      WHERE email = $1 AND mot_de_passe = $2
    `,
      [email, mot_de_passe]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
