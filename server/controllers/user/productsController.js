const Product = require("../../model/productModel");

const listProducts = async (req, res) => {
  const {
    search,
    type, // 0 for Laptop, 1 for Accessories
    category, // Applicable for both laptops and accessories
    screen_size, // Laptops only
    os, // Laptops only
    gpu, // Laptops only
    storage, // Laptops only
    brandname,
    sortby, // e.g., price, releaseDate, rating
    order = "asc", // Default sort order
  } = req.query;

  try {
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (type !== undefined) {
      query.type = Number(type);
    }

    if (category) {
    }

    if (screen_size) {
      query["spec.screensize"] = screen_size;
    }

    if (os) {
      query["spec.os"] = { $regex: os, $options: "i" };
    }

    if (gpu) {
      query["spec.gpu"] = { $regex: gpu, $options: "i" };
    }

    if (storage) {
      query["spec.storage"] = { $regex: storage, $options: "i" };
    }

    if (brandname) {
      query["spec.brandname"] = { $regex: brandname, $options: "i" };
    }

    const sort = {};
    if (sortby) {
      const sortOrder = order.toLowerCase() === "desc" ? -1 : 1;
      sort[sortby] = sortOrder;
    }
    console.log("query is ", query, sort)
    const products = await Product.find(query).sort(sort);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
      const { productId } = req.params; // Get the search query parameter 'name'

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: "Product not found", success: false });
      }

      res.status(200).json({
          message: "Product fetched successfully",
          success: true,
          product,
      });
  } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  listProducts,
  getProductById,
};
