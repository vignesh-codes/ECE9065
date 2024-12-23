import React, { useState } from "react";
import { FaBasketballBall } from "react-icons/fa";
import { CardCarousal } from "./CardCarousal";
import { convertDateToRequiredFormat, getToken } from "../../utils/utils";
import { SERVER_ENDPOINT } from "../../assets/endpoints";

export const ProductDetailsPageComponent = ({ productInfo }) => {
    if (!productInfo) {
        return <p>Loading...</p>;
    }

    // Calculate discount
    const discount = productInfo.priceBeforeDiscount
        ? (((productInfo.priceBeforeDiscount - productInfo.price) / productInfo.priceBeforeDiscount) * 100).toFixed(2)
        : null;

    const handleAddToCart = async (product_id, quantityChange) => {
        console.log('Adding to cart ', product_id, quantityChange);
        if (productInfo.availableStocks <= 0) {
            alert('No stocks available for this product.');
            return; // Don't allow adding to cart if no stocks available
        }

        try {
            const payload = JSON.stringify({
                product_id,
                quantity: quantityChange,
            });
            console.log('Payload is ', payload);
            const response = await fetch(`${SERVER_ENDPOINT}/v1/user/cart`, {
                method: 'POST',
                headers: {
                    Authorization: getToken(),
                    'Content-Type': 'application/json',
                },
                body: payload,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to Add to Cart');
            }
            console.log('Product Added to Cart Successfully:', data);
            // refresh the Header
            window.location.reload();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };
    return (
        <div>
            <section className="py-8 px-6 sm:px-12 lg:px-20 bg-gray-50">
                <div className="container mx-auto">
                    {/* Grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                        {/* Product Images */}
                        <div className="relative mt-3 flex rounded-xl bg-yellow-50">
                            <CardCarousal images={productInfo.imageUrls} />
                        </div>


                        {/* Product Details */}
                        <div>
                            {/* Product Name */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                                {productInfo.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, idx) => (
                                    <svg
                                        key={idx}
                                        className={`h-5 w-5 ${idx < Math.round(productInfo.rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                ))}
                                <span className="ml-3 text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                    {productInfo.rating} / 5
                                </span>
                            </div>

                            {/* Pricing */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    ${productInfo.price}
                                    {productInfo.priceBeforeDiscount > productInfo.price && (
                                        <span className="ml-2 text-gray-500 line-through">
                                            ${productInfo.priceBeforeDiscount}
                                        </span>
                                    )}
                                    {discount && (
                                        <span className="ml-2 text-red-500 font-medium">
                                            {discount}% Off
                                        </span>
                                    )}
                                </h2>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Product Details
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    {productInfo.spec?.description || "No description available"}
                                </p>
                            </div>

                            {/* Specifications */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Specifications
                                </h3>
                                <ul className="text-gray-600 mt-2">
                                    {productInfo.type === 0 ? (
                                        <>
                                            <li>Brand: {productInfo.spec?.brandname || "N/A"}</li>
                                            <li>CPU: {productInfo.spec?.cpu || "N/A"}</li>
                                            <li>GPU: {productInfo.spec?.gpu || "N/A"}</li>
                                            <li>Memory: {productInfo.spec?.memory || "N/A"}</li>
                                            <li>Screen Size: {productInfo.spec?.screensize || "N/A"}</li>
                                            <li>Operating System: {productInfo.spec?.os || "N/A"}</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Brand: {productInfo.spec?.brandname || "N/A"}</li>
                                            <li>Category: {productInfo.spec?.category || "N/A"}</li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            {/* Additional Details */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Additional Details
                                </h3>
                                <ul className="text-gray-600 mt-2">
                                    <li>Available Stocks: {productInfo.availableStocks || "N/A"}</li>
                                    <li>Sold Stocks: {productInfo.soldStocks || "N/A"}</li>
                                    <li>Seller: {productInfo.seller || "N/A"}</li>
                                    <li>
                                        Release Date:{" "}
                                        {productInfo.releaseDate
                                            ? convertDateToRequiredFormat(productInfo.releaseDate)
                                            : "N/A"}
                                    </li>
                                </ul>
                            </div>

                            {/* Add to Cart Button */}
                            {productInfo.availableStocks > 0 ? (
                                <button
                                    onClick={() => handleAddToCart(productInfo.id, 1)}
                                    className="flex items-center gap-2 mt-1 justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    <FaBasketballBall />
                                    Add to cart
                                </button>
                            ) : (
                                <button
                                    disabled
                                    aria-disabled="true"
                                    className="flex items-center gap-2 mt-1 justify-center rounded-md bg-gray-400 px-5 py-2.5 text-center text-sm font-medium text-white cursor-not-allowed"
                                >
                                    Out of Stock
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

};
