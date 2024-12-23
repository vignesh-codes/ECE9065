const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/middleware")

const userController = require("../controllers/user/cartController")

router.post("/cart", middleware.jwtValidator, middleware.checkIfUser, userController.modifyCart)
router.get("/cart", middleware.jwtValidator, middleware.checkIfUser, userController.getCart)
router.delete("/cart", middleware.jwtValidator, middleware.checkIfUser, userController.deleteCart)
router.post("/cart/checkout", middleware.jwtValidator, middleware.checkIfUser, userController.checkout)
router.get("/cart/completed-orders", middleware.jwtValidator, middleware.checkIfUser, userController.getCompletedOrders)

module.exports = router;

