const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
    }
});

const cartSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    cart_items: [cartItemSchema],
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
