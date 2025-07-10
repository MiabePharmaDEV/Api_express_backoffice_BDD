const express = require("express");
const router = express.Router();
const gardeController = require("../controllers/gardeController");

// Routes CRUD de base
router.get("/", gardeController.getGardes);
router.post("/", gardeController.createGarde);
router.get("/:id", gardeController.getGardeById);
router.put("/:id", gardeController.updateGarde);
router.delete("/:id", gardeController.deleteGarde);

// Routes de recherche
router.get("/actives", gardeController.getGardesActives);
router.get("/pharmacie/:id_pharmacie", gardeController.getGardesByPharmacie);
router.get("/pharmacies/list", gardeController.getPharmaciesList);

module.exports = router;
