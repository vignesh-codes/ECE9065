import React, { useEffect, useState } from 'react';
import { getToken } from '../../utils/utils';
import { SERVER_ENDPOINT } from '../../assets/endpoints';

export const CartPageComponent = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);

    // Function to calculate the total price
    const calculateTotal = (cartItems) => {
        if (!Array.isArray(cartItems)) return 0; // Ensure cartItems is an array
        return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
    };

    const fetchCartItems = async () => {
        try {
            const response = await fetch(`${SERVER_ENDPOINT}/v1/user/cart`, {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            });
            const data = await response.json();

            const fetchedCartItems = data?.cart?.cart_items || [];
            if (!Array.isArray(fetchedCartItems)) {
                throw new TypeError("cartItems is not an array");
            }

            // Mark items that exceed available stocks
            const validatedItems = fetchedCartItems.map((item) => ({
                ...item,
                isOverStocked: item.quantity > item.product_id.availableStocks,
            }));
            // iterate over fetchedCartItems
            for (const item of fetchedCartItems) {
                console.log("Item: ", item.quantity, item.product_id.availableStocks);
            }

            setCartItems(validatedItems);
            setTotal(calculateTotal(validatedItems));

            // Disable checkout if any item is overstocked
            const hasOverstockedItems = validatedItems.some((item) => item.isOverStocked);
            setIsCheckoutDisabled(hasOverstockedItems);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    // Fetch cart items on component mount
    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        console.log("Updated cart items: ", cartItems);
    }, [cartItems]);

    const updateQuantity = async (product_id, quantityChange) => {
        try {
            // Find the item being updated
            const item = cartItems.find((item) => item.product_id._id === product_id);

            // Validate stock before proceeding
            const newQuantity = item.quantity + quantityChange;
            if (newQuantity > item.availableStocks) {
                alert(`Cannot increase quantity. Only ${item.availableStocks} units are available.`);
                return;
            }
            // if (newQuantity <= 0) {
            //     alert("Quantity cannot be less than 1. Please remove the item instead.");
            //     return;
            // }

            // Update state locally
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id._id === product_id
                        ? { ...item, quantity: newQuantity, isOverStocked: false }
                        : item
                )
            );

            // Send update request to the server
            const payload = JSON.stringify({
                product_id,
                quantity: quantityChange,
            });
            const response = await fetch(`${SERVER_ENDPOINT}/v1/user/cart`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + getToken(),
                    "Content-Type": "application/json",
                },
                body: payload,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update quantity");
            }

            console.log("Quantity updated successfully:", data);
            fetchCartItems();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };


    const handleCheckout = async () => {
        try {
            // Fetch the latest cart items to ensure stock availability
            const responseCart = await fetch(`${SERVER_ENDPOINT}/v1/user/cart`, {
                method: "GET",
                headers: {
                    Authorization: getToken(),
                },
            });
            const cartData = await responseCart.json();
    
            if (!responseCart.ok) {
                throw new Error(cartData.message || "Failed to fetch cart items");
            }
            const fetchedCartItems = cartData?.cart?.cart_items || [];
            // Validate stock for each item in the cart
            const stockIssues = fetchedCartItems.filter(
                (item) => item.quantity > item.product_id.availableStocks
            );
    
            if (stockIssues.length > 0) {
                alert(
                    "Some items in your cart exceed available stock. Please adjust your cart before checking out."
                );
                window.location.reload();
                return;
            }
    
            // Proceed with checkout if stock is valid
            const responseCheckout = await fetch(
                `${SERVER_ENDPOINT}/v1/user/cart/checkout`,
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + getToken(),
                        "Content-Type": "application/json",
                    },
                }
            );
    
            const checkoutData = await responseCheckout.json();
    
            if (!responseCheckout.ok) {
                throw new Error(
                    checkoutData.message || "Failed to complete checkout"
                );
            }
    
            console.log("Checkout successful:", checkoutData);
    
            // Clear the cart and fetch updated items
            setCartItems([]);
            fetchCartItems();
        } catch (error) {
            console.error("Error during checkout:", error);
            alert(error.message || "An error occurred during checkout.");
        }
    };
    


    return (
        <div>
            <section className="bg-gray-50 py-10 dark:bg-gray-900">
                <div className="mx-auto max-w-5xl px-4 2xl:px-0">
                    <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center">
                        Shopping Cart
                    </h2>
    
                    <div className="bg-white shadow-lg rounded-lg p-8 dark:bg-gray-800">
                        {/* Cart Table */}
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left font-semibold text-gray-500 uppercase dark:text-gray-400">
                                    <th className="py-4 px-6">Product</th>
                                    <th className="py-4 px-6 text-right">Price</th>
                                    <th className="py-4 px-6 text-center">Quantity</th>
                                    <th className="py-4 px-6 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr
                                        key={item.product_id._id}
                                        className="border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <td className="py-4 px-6 flex items-center space-x-4">
                                            {/* Product Image and Name */}
                                            <img
                                                className="h-12 w-12 rounded-md"
                                                src={item.product_id.image}
                                                alt={item.product_id.name}
                                            />
                                            <div>
                                                <p className="text-gray-800 dark:text-white">{item.product_id.name}</p>
                                                {item.isOverStocked && (
                                                    <p className="text-red-500 text-xs font-semibold">
                                                        Exceeds available stock!
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right text-gray-800 dark:text-white">
                                            ${item.product_id.price.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => updateQuantity(item.product_id._id, -1)}
                                                    className="px-2 py-1 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300"
                                                    
                                                >
                                                    -
                                                </button>
                                                <input
                                                    className="mx-2 w-12 text-center border rounded dark:bg-gray-900 dark:text-white"
                                                    value={item.quantity}
                                                    readOnly
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.product_id._id, 1)}
                                                    className={`px-2 py-1 rounded ${
                                                        item.quantity >= item.availableStocks
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700"
                                                    }`}
                                                    disabled={item.quantity >= item.availableStocks}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right text-gray-800 dark:text-white">
                                            ${(item.quantity * item.product_id.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
    
                        {/* Summary Rows */}
                        {cartItems && cartItems.length > 0 && (
                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    <span>Subtotal:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    <span>Delivery Charges:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">$20.00</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    <span>Tax (5%):</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        ${(total * 0.05).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-800 dark:text-gray-300 text-lg mt-3">
                                    <span>Grand Total:</span>
                                    <span>${(total + 20 + total * 0.05).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
    
                        {/* Checkout Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckoutDisabled}
                                className={`px-6 py-3 rounded-md shadow-md ${
                                    isCheckoutDisabled
                                        ? "bg-gray-400 cursor-not-allowed text-gray-700"
                                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                                }`}
                            >
                                {isCheckoutDisabled ? "Fix Issues to Checkout" : "Checkout"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
    
};
