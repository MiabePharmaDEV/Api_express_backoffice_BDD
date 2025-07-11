const pool = require("../db");

// Récupérer toutes les catégories
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM categories
      ORDER BY nom
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une catégorie
exports.createCategorie = async (req, res) => {
  const { nom, description } = req.body;
  try {
    // Vérifier si la catégorie existe déjà par le nom
    const checkExisting = await pool.query(
      "SELECT id_categorie FROM categories WHERE nom = $1",
      [nom]
    );

    if (checkExisting.rows.length > 0) {
      return res.status(400).json({
        error: "Une catégorie avec ce nom existe déjà",
      });
    }

    const result = await pool.query(
      "INSERT INTO categories (nom, description) VALUES ($1, $2) RETURNING *",
      [nom, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Si c'est un problème de séquence, essayer de la réinitialiser
    if (err.code === "23505") {
      // Code d'erreur pour violation de contrainte unique
      try {
        // Réinitialiser la séquence
        await pool.query(
          "SELECT setval('categories_id_categorie_seq', (SELECT MAX(id_categorie) FROM categories))"
        );

        // Réessayer l'insertion
        const result = await pool.query(
          "INSERT INTO categories (nom, description) VALUES ($1, $2) RETURNING *",
          [nom, description]
        );
        res.status(201).json(result.rows[0]);
      } catch (retryErr) {
        res.status(500).json({ error: retryErr.message });
      }
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Afficher une catégorie par son ID
exports.getCategorieById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE id_categorie = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier une catégorie
exports.updateCategorie = async (req, res) => {
  const { id } = req.params;
  const { nom, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE categories SET nom = $1, description = $2 WHERE id_categorie = $3 RETURNING *",
      [nom, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une catégorie
exports.deleteCategorie = async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifier s'il y a des produits dans cette catégorie
    const checkProduits = await pool.query(
      "SELECT COUNT(*) as count FROM produits WHERE id_categorie = $1",
      [id]
    );

    if (parseInt(checkProduits.rows[0].count) > 0) {
      return res.status(400).json({
        error:
          "Impossible de supprimer cette catégorie car elle contient des produits",
      });
    }

    const result = await pool.query(
      "DELETE FROM categories WHERE id_categorie = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rechercher une catégorie par nom
exports.getCategorieByNom = async (req, res) => {
  const { nom } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE nom ILIKE $1",
      [`%${nom}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer une catégorie avec ses produits
exports.getCategorieWithProduits = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        c.*,
        COUNT(p.id_produit) as nombre_produits
      FROM categories c
      LEFT JOIN produits p ON c.id_categorie = p.id_categorie
      WHERE c.id_categorie = $1
      GROUP BY c.id_categorie, c.nom, c.description
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    // Récupérer les produits de cette catégorie
    const produits = await pool.query(
      `
      SELECT * FROM produits WHERE id_categorie = $1
    `,
      [id]
    );

    const categorie = result.rows[0];
    categorie.produits = produits.rows;

    res.json(categorie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer toutes les catégories avec le nombre de produits
exports.getCategoriesWithCount = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        COUNT(p.id_produit) as nombre_produits
      FROM categories c
      LEFT JOIN produits p ON c.id_categorie = p.id_categorie
      GROUP BY c.id_categorie, c.nom, c.description
      ORDER BY c.nom
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
