const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateurController");

// Routes CRUD de base
router.get("/", utilisateurController.getUtilisateurs);
router.post("/", utilisateurController.createUtilisateur);
router.get("/:id", utilisateurController.getUtilisateurById);
router.put("/:id", utilisateurController.updateUtilisateur);
router.delete("/:id", utilisateurController.deleteUtilisateur);

// Routes de recherche
router.get("/email/:email", utilisateurController.getUtilisateurByEmail);
router.get(
  "/telephone/:telephone",
  utilisateurController.getUtilisateurByTelephone
);

// Route d'authentification
router.post("/login", utilisateurController.login);

module.exports = router;
