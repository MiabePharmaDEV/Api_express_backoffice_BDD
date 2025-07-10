const express = require("express");
const router = express.Router();
const pharmacienController = require("../controllers/pharmacienController");

// Routes CRUD de base
router.get("/", pharmacienController.getPharmaciens);
router.post("/", pharmacienController.createPharmacien);
router.get("/:id", pharmacienController.getPharmacienById);
router.put("/:id", pharmacienController.updatePharmacien);
router.delete("/:id", pharmacienController.deletePharmacien);

// Recherche par nom_utilisateur
router.get(
  "/username/:nom_utilisateur",
  pharmacienController.getPharmacienByUsername
);

// Authentification
router.post("/login", pharmacienController.login);

module.exports = router;
