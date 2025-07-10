const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produitController");

// Routes CRUD de base
router.get("/", produitController.getProduits);
router.post("/", produitController.createProduit);
router.get("/:id", produitController.getProduitById);
router.put("/:id", produitController.updateProduit);
router.delete("/:id", produitController.deleteProduit);

// Route pour récupérer les produits par catégorie
router.get(
  "/categorie/:id_categorie",
  produitController.getProduitsByCategorie
);

module.exports = router;
