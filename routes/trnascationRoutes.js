const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transcationControler");

router.post("/create", transactionController.createTransaction);
router.get("/get-all", transactionController.getAllTransaction);
router.put("/update/:_id", transactionController.updateTransaction);
router.delete("/delete/:_id", transactionController.deleteTransaction);
router.get("/report", transactionController.transactionReport);

module.exports = router;
