const Cart = require("../../model/cartModel"); 
const Product = require("../../model/productModel"); 

const modifyCart = async (req, res) => {
    const email = req.user.email;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(400).json({ error: "product_id and quantity are required" });
    }

    try {
        console.log("product id is ---->", product_id)
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let cart = await Cart.findOne({ email, status: "active" });

        if (!cart) {
            cart = new Cart({
                email,
                cart_items: [],
                status: "active",
            });
        }

        const existingItem = cart.cart_items.find((item) => item.product_id.toString() === product_id);

        if (existingItem) {
            existingItem.quantity += quantity;

            if (existingItem.quantity <= 0) {
                cart.cart_items = cart.cart_items.filter(
                    (item) => item.product_id.toString() !== product_id
                );
            }
        } else {
            if (quantity > 0) {
                cart.cart_items.push({
                    product_id,
                    price: product.price,
                    quantity,
                });
            } else {
                return res.status(400).json({ error: "Cannot add a product with zero or negative quantity" });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getCart = async (req, res) => {
    const email = req.user.email;

    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }

    try {
        const cart = await Cart.findOne({ email, status: "active" }).populate("cart_items.product_id");

        if (!cart) {
            return res.status(200).json({ total_items: 0, cart: {} });
        }

        res.status(200).json({ total_items: cart.cart_items.length, cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Delete cart for a user
 */
const deleteCart = async (req, res) => {
    const email = req.user.email;

    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }

    try {
        const cart = await Cart.findOneAndDelete({ email, status: "active" });

        if (!cart) {
            return res.status(404).json({ error: "No active cart found to delete" });
        }

        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getCompletedOrders = async (req, res) => {
    const email = req.user.email;

    try {
        const completedOrders = await Cart.find({
            email,
            status: "completed",
        });
        console.log("completed orders ", completedOrders, email);

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



const checkout = async (req, res) => {
    const email = req.user.email;

    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }
  
    try {
      const activeCart = await Cart.findOne({ email, status: "active" });
  
      if (!activeCart) {
        return res.status(404).json({ message: "No active cart found for this user." });
      }
  
      activeCart.status = "completed";
      await activeCart.save();
  
      const cartItems = activeCart.cart_items;
  
      for (const item of cartItems) {
        const { product_id, quantity } = item;
  
        const product = await Product.findById(product_id);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product with ID ${product_id} not found.` });
        }
  
        if (product.availableStocks < quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product ${product.name}. Available: ${product.availableStocks}, Requested: ${quantity}`,
          });
        }

        product.availableStocks -= quantity;
        product.soldStocks += quantity;
        await product.save();
      }
  
      res.status(200).json({
        message: "Checkout completed successfully.",
        cart: activeCart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


module.exports = {
    modifyCart,
    getCart,
    deleteCart,
    checkout,
    getCompletedOrders,
};
