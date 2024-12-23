const mongoose = require("mongoose");

// Laptop Specification Schema
const laptopSchema = new mongoose.Schema({
    brandname: { type: String, required: true },
    screensize: { type: String, required: true },
    memory: { type: String, required: true },
    storage: { type: String, required: true },
    category: { type: String, required:true },
    cpu: { type: String, required: true },
    gpu: { type: String, required: true },
    os: { type: String, required: true },
    description: { type: String, required: true },
});

// Accessory Specification Schema
const accessorySchema = new mongoose.Schema({
    description: { type: String, required: true },
    brandname: { type: String, required: true },
    category: { type: String, required: true },
});

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: Number, 
      required: true, 
      enum: [0, 1], // 0 for laptop, 1 for accessory
    },
    price: { type: Number, required: true },
    priceBeforeDiscount: { type: Number, required: true },
    spec: { 
      type: mongoose.Schema.Types.Mixed, 
      required: true,
    },
    availableStocks: { type: Number, required: true },
    soldStocks: { type: Number, default: 0 },
    seller: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 }, 
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
