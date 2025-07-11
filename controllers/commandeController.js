const pool = require("../db");

// Récupérer toutes les commandes
exports.getCommandes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        p.nom as nom_pharmacie,
        p.emplacement as emplacement_pharmacie,
        u.nom as nom_utilisateur,
        u.prenoms as prenoms_utilisateur,
        u.telephone as telephone_utilisateur
      FROM commandes c
      LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
      LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateur
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une commande
exports.createCommande = async (req, res) => {
  const { id_pharmacie, id_utilisateur, produits, statut, code_commande } =
    req.body;
  try {
    // S'assurer que produits est un JSON valide
    let produitsJson = produits;
    if (typeof produits === "string") {
      produitsJson = produits;
    } else if (Array.isArray(produits)) {
      produitsJson = JSON.stringify(produits);
    } else {
      produitsJson = JSON.stringify(produits || []);
    }

    const result = await pool.query(
      "INSERT INTO commandes (id_pharmacie, id_utilisateur, produits, statut, code_commande) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        id_pharmacie,
        id_utilisateur,
        produitsJson,
        statut || "en cours",
        code_commande,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Afficher une commande par son ID
exports.getCommandeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        c.*,
        p.nom as nom_pharmacie,
        p.emplacement as emplacement_pharmacie,
        p.telephone1 as telephone_pharmacie,
        u.nom as nom_utilisateur,
        u.prenoms as prenoms_utilisateur,
        u.telephone as telephone_utilisateur,
        u.email as email_utilisateur
      FROM commandes c
      LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
      LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateur
      WHERE c.id_commande = $1
    `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier une commande
exports.updateCommande = async (req, res) => {
  const { id } = req.params;
  const { id_pharmacie, id_utilisateur, produits, statut, code_commande } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE commandes SET id_pharmacie = $1, id_utilisateur = $2, produits = $3, statut = $4, code_commande = $5 WHERE id_commande = $6 RETURNING *",
      [id_pharmacie, id_utilisateur, produits, statut, code_commande, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une commande
exports.deleteCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM commandes WHERE id_commande = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.json({ message: "Commande supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les commandes par pharmacie
exports.getCommandesByPharmacie = async (req, res) => {
  const { id_pharmacie } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        c.*,
        u.nom as nom_utilisateur,
        u.prenoms as prenoms_utilisateur,
        u.telephone as telephone_utilisateur
      FROM commandes c
      LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateur
      WHERE c.id_pharmacie = $1
      ORDER BY c.created_at DESC
    `,
      [id_pharmacie]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les commandes par utilisateur
exports.getCommandesByUtilisateur = async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        c.*,
        p.nom as nom_pharmacie,
        p.emplacement as emplacement_pharmacie,
        p.telephone1 as telephone_pharmacie
      FROM commandes c
      LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
      WHERE c.id_utilisateur = $1
      ORDER BY c.created_at DESC
    `,
      [id_utilisateur]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les commandes par statut
exports.getCommandesByStatut = async (req, res) => {
  const { statut } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        c.*,
        p.nom as nom_pharmacie,
        p.emplacement as emplacement_pharmacie,
        u.nom as nom_utilisateur,
        u.prenoms as prenoms_utilisateur
      FROM commandes c
      LEFT JOIN pharmacies p ON c.id_pharmacie = p.id_pharmacie
      LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateur
      WHERE c.statut = $1
      ORDER BY c.created_at DESC
    `,
      [statut]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
