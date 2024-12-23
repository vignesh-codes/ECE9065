import React, { useState } from 'react';
import { SERVER_ENDPOINT } from '../../assets/endpoints';

export const CreateProductForm = ({ onClose }) => {
    const [productType, setProductType] = useState("0"); // Default to 'Laptop'
    const [productData, setProductData] = useState({
        name: '',
        price: 0,
        priceBeforeDiscount: 0,
        availableStocks: 0,
        soldStocks: 0,
        seller: '',
        rating: 0,
        spec: {
            brandname: '',
            screensize: '',
            memory: '',
            cpu: '',
            gpu: '',
            os: '',
            category: '',
            description: '',
        },
        releaseDate: "2024-02-01"// todays date in YYYY-MM-DD format
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('spec.')) {
            const specField = name.split('.')[1];
            setProductData(prevState => ({
                ...prevState,
                spec: { ...prevState.spec, [specField]: value }
            }));
        } else {
            setProductData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleTypeChange = (e) => {
        setProductType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProduct = { ...productData, type: parseInt(productType) };
        console.log("product to create: ", newProduct)
        try {
            const response = await fetch(`${SERVER_ENDPOINT}/v1/admin/products/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            const result = await response.json();
            if (result.success) {
                alert('Product created successfully');
            } else {
                alert('Error creating product: ' + result.message);
            }
        } catch (error) {
            alert('Error creating product: ' + error.message);
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit} className="p-6 ">
                <h2 className="text-2xl font-bold">Create Product</h2>

                <div>
                    <label htmlFor="type" className="block">Type</label>
                    <select
                        id="type"
                        name="type"
                        value={productType}
                        onChange={handleTypeChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="0">Laptop</option>
                        <option value="1">Accessory</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="name" className="block">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="priceBeforeDiscount" className="block">Price Before Discount</label>
                    <input
                        type="number"
                        id="priceBeforeDiscount"
                        name="priceBeforeDiscount"
                        value={productData.priceBeforeDiscount}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="availableStocks" className="block">Available Stocks</label>
                    <input
                        type="number"
                        id="availableStocks"
                        name="availableStocks"
                        value={productData.availableStocks}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="soldStocks" className="block">Sold Stocks</label>
                    <input
                        type="number"
                        id="soldStocks"
                        name="soldStocks"
                        value={productData.soldStocks}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="seller" className="block">Seller</label>
                    <input
                        type="text"
                        id="seller"
                        name="seller"
                        value={productData.seller}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="rating" className="block">Rating</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        value={productData.rating}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="releaseDate" className="block">Release Date</label>
                    <input
                        type="date"
                        id="spec.releaseDate"
                        name="spec.releaseDate"
                        value={productData.releaseDate}
                        // onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={"2024-02-01"}
                    />
                </div>

                {/* Laptop Specific Fields */}
                {productType === "0" && (
                    <>
                        <div>
                            <label htmlFor="spec.brandname" className="block">Brand Name</label>
                            <input
                                type="text"
                                id="spec.brandname"
                                name="spec.brandname"
                                value={productData.spec.brandname}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="spec.screensize" className="block">Screen Size</label>
                            <input
                                type="text"
                                id="spec.screensize"
                                name="spec.screensize"
                                value={productData.spec.screensize}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="spec.memory" className="block">Memory</label>
                            <input
                                type="text"
                                id="spec.memory"
                                name="spec.memory"
                                value={productData.spec.memory}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="spec.cpu" className="block">CPU</label>
                            <input
                                type="text"
                                id="spec.cpu"
                                name="spec.cpu"
                                value={productData.spec.cpu}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="spec.gpu" className="block">GPU</label>
                            <input
                                type="text"
                                id="spec.gpu"
                                name="spec.gpu"
                                value={productData.spec.gpu}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="spec.os" className="block">Operating System</label>
                            <input
                                type="text"
                                id="spec.os"
                                name="spec.os"
                                value={productData.spec.os}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    </>
                )}

                {/* Accessory Specific Fields */}
                {productType === "1" && (
                    <>
                        <div>
                            <label htmlFor="spec.category" className="block">Category</label>
                            <input
                                type="text"
                                id="spec.category"
                                name="spec.category"
                                value={productData.spec.category}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="spec.description" className="block">Description</label>
                            <input
                                type="text"
                                id="spec.description"
                                name="spec.description"
                                value={productData.spec.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>


                    </>
                )}

                <div className="flex justify-end">
                    <button type="submit" className="bg-yellow-500 text-white p-2 rounded-md">Save</button>
                </div>
            </form>
        </div>
    );
};

