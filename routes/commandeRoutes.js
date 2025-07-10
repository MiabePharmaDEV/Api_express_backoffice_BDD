const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");

// Routes CRUD de base
router.get("/", commandeController.getCommandes);
router.post("/", commandeController.createCommande);
router.get("/:id", commandeController.getCommandeById);
router.put("/:id", commandeController.updateCommande);
router.delete("/:id", commandeController.deleteCommande);

// Routes de filtrage
router.get(
  "/pharmacie/:id_pharmacie",
  commandeController.getCommandesByPharmacie
);
router.get(
  "/utilisateur/:id_utilisateur",
  commandeController.getCommandesByUtilisateur
);
router.get("/statut/:statut", commandeController.getCommandesByStatut);

module.exports = router;
