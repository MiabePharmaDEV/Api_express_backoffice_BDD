const { Pool } = require("pg");
const pool = new Pool();

// Récupérer tous les produits
exports.getProduits = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nom as nom_categorie 
      FROM produits p 
      LEFT JOIN categories c ON p.id_categorie = c.id_categorie
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un produit
exports.createProduit = async (req, res) => {
  const {
    id_categorie,
    libelle,
    description,
    unites,
    prix_unitaire,
    sur_ordonnance,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO produits (id_categorie, libelle, description, unites, prix_unitaire, sur_ordonnance) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        id_categorie,
        libelle,
        description,
        unites,
        prix_unitaire,
        sur_ordonnance,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Afficher un produit par son ID
exports.getProduitById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT p.*, c.nom as nom_categorie 
      FROM produits p 
      LEFT JOIN categories c ON p.id_categorie = c.id_categorie 
      WHERE p.id_produit = $1
    `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier un produit
exports.updateProduit = async (req, res) => {
  const { id } = req.params;
  const {
    id_categorie,
    libelle,
    description,
    unites,
    prix_unitaire,
    sur_ordonnance,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE produits SET id_categorie = $1, libelle = $2, description = $3, unites = $4, prix_unitaire = $5, sur_ordonnance = $6 WHERE id_produit = $7 RETURNING *",
      [
        id_categorie,
        libelle,
        description,
        unites,
        prix_unitaire,
        sur_ordonnance,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un produit
exports.deleteProduit = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM produits WHERE id_produit = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les produits par catégorie
exports.getProduitsByCategorie = async (req, res) => {
  const { id_categorie } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT p.*, c.nom as nom_categorie 
      FROM produits p 
      LEFT JOIN categories c ON p.id_categorie = c.id_categorie 
      WHERE p.id_categorie = $1
    `,
      [id_categorie]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
