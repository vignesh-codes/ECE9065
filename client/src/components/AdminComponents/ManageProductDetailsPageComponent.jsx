/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { FaBasketballBall } from "react-icons/fa";
import { convertDateToRequiredFormat, getToken } from '../../utils/utils';
import { SERVER_ENDPOINT } from '../../assets/endpoints';

export const ManageProductDetailsPageComponent = ({ productInfo }) => {
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: productInfo.name || "",
    type: productInfo.type || 0,
    price: productInfo.price || 0,
    priceBeforeDiscount: productInfo.priceBeforeDiscount || 0,
    spec: {
      brandname: productInfo.spec.brandname || "",
      screensize: productInfo.spec.screensize || "",
      memory: productInfo.spec.memory || "",
      cpu: productInfo.spec.cpu || "",
      gpu: productInfo.spec.gpu || "",
      os: productInfo.spec.os || "",
      description: productInfo.spec.description || "",
    },
    availableStocks: productInfo.availableStocks || 0,
    soldStocks: productInfo.soldStocks || 0,
    seller: productInfo.seller || "",
    rating: productInfo.rating || 0,
    releaseDate: convertDateToRequiredFormat(productInfo.releaseDate) || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: name === "type" || name === "price" || name === "availableStocks" || name === "soldStocks" ? parseFloat(value) : value,
    }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      spec: {
        ...prev.spec,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/v1/admin/products/${productInfo._id}`, {
        method: "PUT",
        headers: {
          Authorization: getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetails),
      });
      const data = await response.json();
      if (data.success) {
        alert("Product details saved successfully!");
      } else {
        alert("Failed to save product details.");
      }
    } catch (error) {
      console.error("Error saving product details:", error);
      alert("An error occurred while saving the product details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="py-8 px-6 sm:px-12 lg:px-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Product Details</h1>

          {/* General Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={productDetails.name}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={productDetails.price}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Available Stocks</label>
              <input
                type="number"
                name="availableStocks"
                value={productDetails.availableStocks}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sold Stocks</label>
              <input
                type="number"
                name="soldStocks"
                value={productDetails.soldStocks}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                value={productDetails.rating}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={productDetails.releaseDate}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Seller</label>
              <input
                type="text"
                name="seller"
                value={productDetails.seller}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Specifications */}
          <h2 className="text-lg font-semibold text-gray-700 mt-6">Specifications</h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(productDetails.spec).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleSpecChange}
                  className="block w-full border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="mt-6 px-6 py-3 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
};
