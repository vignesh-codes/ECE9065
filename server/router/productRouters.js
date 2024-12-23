const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/middleware");

const productController = require("../controllers/user/productsController");

router.get("/", middleware.jwtValidator, middleware.checkIfUser, productController.listProducts);
router.get("/:productId", middleware.jwtValidator, middleware.checkIfUser, productController.getProductById);

module.exports = router;

