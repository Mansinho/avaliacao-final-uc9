const { Router } = require("express");
const contaController = require("../controller/contaController");

const router = Router();

router.post("/", contaController.cadastrar);
router.get("/", contaController.listar);

module.exports = router;
