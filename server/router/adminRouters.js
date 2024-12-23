const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin/manageProducts"); // Import admin controller
const middleware = require("../middlewares/middleware"); 

router.put("/products/:productId", middleware.jwtValidator, middleware.checkIfAdmin, adminController.manageProduct);
router.get("/products/:productId", middleware.jwtValidator, middleware.checkIfAdmin, adminController.getProductById);

router.delete("/products/:productId", middleware.jwtValidator, middleware.checkIfAdmin, adminController.deleteProduct);

router.get("/products", middleware.jwtValidator, middleware.checkIfAdmin, adminController.getAllProducts);

router.post("/products", middleware.jwtValidator, middleware.checkIfAdmin, adminController.createProduct);

router.get("/completed-orders", middleware.jwtValidator, middleware.checkIfAdmin, adminController.getCompletedOrders);

module.exports = router;
