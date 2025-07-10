const express = require("express");
const router = express.Router();
const pharmacieController = require("../controllers/pharmacieController");

router.get("/", pharmacieController.getPharmacies);
router.post("/", pharmacieController.createPharmacie);
router.get("/:id", pharmacieController.getPharmacieById);
router.put("/:id", pharmacieController.updatePharmacie);
router.delete("/:id", pharmacieController.deletePharmacie);

module.exports = router;
