import React, { useState, useEffect } from 'react';
import { getToken } from '../../utils/utils';
import { SERVER_ENDPOINT } from '../../assets/endpoints';

export const CompletedOrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch completed orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${SERVER_ENDPOINT}/v1/admin/completed-orders`, {
          method: 'GET',
          headers: {    
            'Authorization': getToken()
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleDetails = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? { ...order, expanded: !order.expanded }
          : order
      )
    );
  };

  if (loading) {
    return <div className="text-center py-10">Loading completed orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Completed Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No completed orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">Order ID: {order.id}</h3>
                  <p className="text-gray-500">Status: <span className="font-medium">{order.status}</span></p>
                  <p className="text-gray-400">Email: {order.email}</p>
                  <p className="text-gray-400">Created: {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <button
                  onClick={() => toggleDetails(order.id)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  {order.expanded ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {order.expanded && (
                <div className="p-6 bg-gray-50">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Items in this order:</h4>
                  {order.cart_items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-6 mb-4">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800">{item.name || 'Product not found'}</p>
                        {item.productDetails && (
                          <div className="text-sm text-gray-600 mt-2">
                            <p><strong>Type:</strong> {item.productDetails.type}</p>
                            <p><strong>Specs:</strong> {JSON.stringify(item.productDetails.spec)}</p>
                            <p><strong>Available Stocks:</strong> {item.productDetails.availableStocks}</p>
                            <p><strong>Sold Stocks:</strong> {item.productDetails.soldStocks}</p>
                            <p><strong>Seller:</strong> {item.productDetails.seller}</p>
                            <p><strong>Rating:</strong> {item.productDetails.rating}</p>
                            <p><strong>Release Date:</strong> {new Date(item.productDetails.releaseDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">Price: ${item.price}</p>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


