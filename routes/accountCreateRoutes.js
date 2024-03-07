const express = require("express");
const { createAccount, getAccount, getAllAccount, deleteAccount, updateAccount } = require("../controllers/accountCreateController");

const router = express.Router();

router.post("/create", createAccount);
router.get("/get-all", getAllAccount);
router.get("/:accountNo", getAccount);
router.put("/update/:_id", updateAccount);
router.delete("/delete/:_id", deleteAccount);

module.exports = router;
