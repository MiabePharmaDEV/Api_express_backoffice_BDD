const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/categorieController");

// Routes CRUD de base
router.get("/", categorieController.getCategories);
router.post("/", categorieController.createCategorie);
router.get("/:id", categorieController.getCategorieById);
router.put("/:id", categorieController.updateCategorie);
router.delete("/:id", categorieController.deleteCategorie);

// Routes de recherche et statistiques
router.get("/nom/:nom", categorieController.getCategorieByNom);
router.get("/:id/produits", categorieController.getCategorieWithProduits);
router.get("/stats/count", categorieController.getCategoriesWithCount);

module.exports = router;
