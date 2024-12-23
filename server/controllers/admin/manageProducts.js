const Product = require("../../model/productModel");
const Cart = require("../../model/cartModel"); 
// Controller to manage a product (update)
const manageProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updatedData = req.body;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required", success: false });
        }

        // Find product and update it
        const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product,
        });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Controller to delete a product
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required", success: false });
        }

        // Delete product by ID
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            success: true,
        });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { name } = req.query; // Get the search query parameter 'name'

        let query = {};
        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        const products = await Product.find(query);
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products,
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: "Internal server error", success: false });
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

const createProduct = async (req, res) => {
    try {
        const { name, type, price, priceBeforeDiscount, spec, availableStocks, soldStocks, seller, rating, releaseDate } = req.body;

        console.log(name, type, price, priceBeforeDiscount, spec, availableStocks, soldStocks, seller, rating, releaseDate)
        if (!name || !price || !priceBeforeDiscount || !spec || !availableStocks || !seller || rating === undefined || releaseDate === undefined) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const newProduct = new Product({
            name,
            type,
            price,
            priceBeforeDiscount,
            spec,
            availableStocks,
            soldStocks: soldStocks || 0,
            seller,
            rating,
            releaseDate,
        });

        const savedProduct = await newProduct.save();
        console.log("savedProdcuts ", savedProduct)
        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product: savedProduct,
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const getCompletedOrders = async (req, res) => {

    try {
        const completedOrders = await Cart.find({
            status: "completed",
        });
        console.log("completed orders ", completedOrders);

        if (completedOrders.length === 0) {
            return res.status(404).json({ message: "No completed orders found for this user." });
        }

        const ordersWithDetails = await Promise.all(
            completedOrders.map(async (order) => {
                const detailedItems = await Promise.all(
                    order.cart_items.map(async (item) => {
                        const product = await Product.findById(item.product_id);

                        return {
                            product_id: product?._id || item.product_id,
                            name: product?.name || null,
                            price: item.price,
                            quantity: item.quantity,
                            productDetails: product
                                ? {
                                      type: product.type,
                                      spec: product.spec,
                                      availableStocks: product.availableStocks,
                                      soldStocks: product.soldStocks,
                                      seller: product.seller,
                                      rating: product.rating,
                                      releaseDate: product.releaseDate,
                                  }
                                : `Product with ID ${item.product_id} not found.`,
                        };
                    })
                );

                return {
                    id: order._id,
                    email: order.email,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    cart_items: detailedItems,
                };
            })
        );

        res.status(200).json({
            message: "Completed orders retrieved successfully.",
            orders: ordersWithDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    manageProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    createProduct,
    getCompletedOrders,
};
