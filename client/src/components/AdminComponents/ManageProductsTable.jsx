import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { getToken } from '../../utils/utils';
import { CreateProductForm } from './CreateProductForm';
import { SERVER_ENDPOINT } from '../../assets/endpoints';

export const ManageProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Fetch products from the API
    const fetchProducts = async (query = "") => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_ENDPOINT}/v1/admin/products?name=${query}`, {
                method: 'GET',
                headers: {
                    Authorization: getToken(),
                },
            });
            const data = await response.json();
            if (data.success) {
                const formattedProducts = data.products.map((product) => ({
                    id: product._id,
                    img: product.spec.imageUrl || "https://via.placeholder.com/100",
                    name: product.name,
                    stock: product.availableStocks,
                    sold: product.soldStocks,
                }));
                setProducts(formattedProducts);
                console.log("products is ", products)
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts("");
    }, [""]);
    // Handle search input
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchProducts(query); // Call the API with the search query
    };

    const handleDelete = async (productId) => {
        console.log("id is ", productId)
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_ENDPOINT}/v1/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: getToken(),
                },
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Products</h2>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                
            </div>
            {loading ? (
                <div className="text-center py-4">Loading products...</div>
            ) : (
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Product Image</th>
                            <th className="border border-gray-300 px-4 py-2">Product Name</th>
                            <th className="border border-gray-300 px-4 py-2">Available Stock</th>
                            <th className="border border-gray-300 px-4 py-2">Sold Count</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.sold}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                        <a href={`/admin/manage/${product.id}`}>
                                            <button className="text-blue-500">
                                                <FaEdit />
                                            </button>
                                        </a>

                                        <button className="text-red-500">
                                            <FaTrashAlt onClick={() => handleDelete(product.id)} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
