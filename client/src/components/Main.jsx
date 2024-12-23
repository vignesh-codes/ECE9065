// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { BreadCrumbs } from './BreadCrumbs';
import { ProductCardContainer } from './UsersComponents/ProductCardContainer';
import { CartPageComponent } from './UsersComponents/CartPageComponent';
import { HomePageComponent } from './UsersComponents/HomePageComponent';
import { ProductDetailsPageComponent } from './UsersComponents/ProductDetailsPageComponent';
import { products } from '../assets/products';
import { useParams } from 'react-router-dom';
import { AdminPageComponent } from './AdminComponents/AdminPageComponent';
import { ManageProductsPageComponents } from './AdminComponents/ManageProductsPageComponents';
import { SearchOptions } from './SearchOptions';
import { ManageProductDetailsPageComponent } from './AdminComponents/ManageProductDetailsPageComponent';
import { decodeJWT, getToken } from '../utils/utils';
import { CompletedOrdersPageComponent } from './UsersComponents/CompletedOrdersPageComponent';
import { CART_TOTAL } from "./Header"
import { subscribeToCart } from './CartContext';
import { SERVER_ENDPOINT } from '../assets/endpoints';

export const GetCartItems = async () => {
  try {
    // Get the authentication token from localStorage
    const authToken = localStorage.getItem('token');
    
    // Ensure the token exists before making the request
    if (!authToken) {
      console.error('User not authenticated. Token missing.');
      return 0; // Return 0 items if not authenticated
    }
    
    // Fetch the cart data from the API
    const response = await fetch(`${SERVER_ENDPOINT}/v1/user/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authToken}`, // Include the token in the Authorization header
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      console.error('Failed to fetch cart items:', response.status, response.statusText);
      return 0; // Return 0 items if the request fails
    }

    // Parse the JSON response
    const data = await response.json();
    console.log("cart items total = ", data)
    // Return the total_items from the response
    return data.total_items || 0; // Default to 0 if total_items is missing
  }
  catch (error) {
    console.error('Error fetching cart items:', error);
    return 0; // Return 0 items if there's an error
  }
}

export const AccessoriesPage = () => {

  const breadcrumbs = [
    { label: "Home", href: "/home" },
    { label: "Accessories", href: "/accessories" },
  ];

  const authToken = localStorage.getItem('token');

  // States for search, filters, and sort
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [cartTotalItems, setCartTotalItems] = useState(0);
  const [url, setUrl] = useState(`${SERVER_ENDPOINT}/v1/products?type=1`);
  
  // Update the URL whenever search, filters, or sort changes
  useEffect(() => {
    let query = `?type=1`;
  
    if (search) query += `&search=${encodeURIComponent(search)}`;
  
    if (sort) {
      // Decode the sort value to handle "&" properly
      const decodedSort = decodeURIComponent(sort);
      console.log("decodedSort is ", decodedSort)
      query += `&sortby=${decodedSort}`;
    }
  
    console.log("sort is ", sort);
    setUrl(`${SERVER_ENDPOINT}/v1/products${query}`);
    const fetchCartItems = async () => {
      const totalItems = await GetCartItems();
      setCartTotalItems(totalItems);
    };

    fetchCartItems();
    console.log("url is ", url);
  }, [search, sort]);

  return (
    <div>
      <Header cart_total_items={cartTotalItems}>
      <SearchOptions
          search={search}
          setSearch={setSearch}
          filters={null}
          setFilters={null}
          sort={sort}
          setSort={setSort}
        />
        <BreadCrumbs crumbs={breadcrumbs} />
        
        <ProductCardContainer url={url} authToken={authToken} />
      </Header>
    </div>
  );
};

export const ProductsPage = () => {
  const breadcrumbs = [
    { label: "Home", href: "/home" },
    { label: "Laptops", href: "/products" },
  ];

  const authToken = localStorage.getItem('token');

  // States for search, filters, sort, and cart total items
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    os: '',
  });
  const [sort, setSort] = useState('');
  const [cartTotalItems, setCartTotalItems] = useState(0);
  const [url, setUrl] = useState(`${SERVER_ENDPOINT}/v1/products?type=0`);

  // Update the URL whenever search, filters, or sort changes
  useEffect(() => {
    let query = `?type=0`;

    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (filters.brand) query += `&brandname=${encodeURIComponent(filters.brand)}`;
    if (filters.os) query += `&os=${encodeURIComponent(filters.os)}`;
    if (sort) {
      const decodedSort = decodeURIComponent(sort);
      query += `&sortby=${decodedSort}`;
    }

    setUrl(`${SERVER_ENDPOINT}/v1/products${query}`);

    const fetchCartItems = async () => {
      const totalItems = await GetCartItems();
      setCartTotalItems(totalItems);
    };

    fetchCartItems();
  }, [search, filters, sort]);
  subscribeToCart((newTotal) => {
    setCartTotalItems(newTotal);
  });
  return (
    <div>
      <Header cart_total_items={cartTotalItems}>
        <SearchOptions
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
        />
        <BreadCrumbs crumbs={breadcrumbs} />
        
        <ProductCardContainer url={url} authToken={authToken} />
      </Header>
    </div>
  );
};


export const Cart = () => {

  const breadcrumbs = [
    { label: "Home", href: "/home"},
    { label: "Laptops", href: "/products"},
    { label: "Cart", href: "/cart" },

  ]
  return (
    <div>
      <Header>
        <BreadCrumbs crumbs={breadcrumbs}></BreadCrumbs>
        <CartPageComponent></CartPageComponent >
      </Header>
    </div>
  );
};

export const Home = () => {

  const breadcrumbs = [
    { label: "Home", href: "/home"},

  ]
  return (
    <div>
      <Header viewSearchOptions={false}>
        <BreadCrumbs crumbs={breadcrumbs}></BreadCrumbs>
        <HomePageComponent></HomePageComponent >
      </Header>
    </div>
  );
};

export const CompletedOrdersPage = () => {

  const breadcrumbs = [
    { label: "Home", href: "/home"},
    { label: "Orders", href: "/orders"},
  ]
  return (
    <div>
      <Header viewSearchOptions={false}>
        <BreadCrumbs crumbs={breadcrumbs}></BreadCrumbs>
        <CompletedOrdersPageComponent></CompletedOrdersPageComponent >
      </Header>
    </div>
  );
};


export const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartTotalItems, setCartTotalItems] = useState(0);
  useEffect(() => {
    // Fetch product details from the API
    const fetchProductInfo = async () => {
      try {
        const response = await fetch(`${SERVER_ENDPOINT}/v1/products/${productId}`, {
          headers: {
            Authorization: getToken(),
          },
        });
        
        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProductInfo(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
    const fetchCartItems = async () => {
      const totalItems = await GetCartItems();
      setCartTotalItems(totalItems);
    };

    fetchCartItems();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productInfo) {
    return <div>Product not found</div>;
  }
  let breadcrumbs = [];
  if (productInfo.type == 1) {
    console.log("prodct info is ", productInfo)
    breadcrumbs = [
      { label: "Home", href: "/home" },
      { label: "Accessories", href: "/accessories"},
      { label: productInfo.product.name, href: `/products/${productInfo.product.id}` },
    ];
  } else {
    breadcrumbs = [
      { label: "Home", href: "/home" },
      { label: "Laptops", href: "/products"},
      { label: productInfo.product.name, href: `/products/${productInfo.product.id}` },
    ];
  }
  
  return (
    <div>
      <Header cart_total_items={cartTotalItems} viewSearchOptions={false}>
        <BreadCrumbs crumbs={breadcrumbs} />
        <ProductDetailsPageComponent productInfo={productInfo.product} type={productInfo.type} />
      </Header>
    </div>
  );
};



// admins
export const AdminPage = () => {

  const breadcrumbs = [
    { label: "Admin", href: "/admin"},
  ]
  return (
    <div>
      <Header>
        <BreadCrumbs crumbs={breadcrumbs}></BreadCrumbs>
        <AdminPageComponent></AdminPageComponent>
      </Header>
    </div>
  );
};

// admins
export const ManageProductsPage = () => {

  const breadcrumbs = [
    { label: "Admin", href: "/admin"},
    { label: "Manage Products", href: "/manage-products"},
  ]
  const jwtPayload = decodeJWT(getToken());
  console.log("payload is ", jwtPayload)
  return (
    <div>
      <Header>
        <BreadCrumbs crumbs={breadcrumbs}></BreadCrumbs>
        <ManageProductsPageComponents></ManageProductsPageComponents>
      </Header>
    </div>
  );
};

// admins
export const ManageProductsDetailsPage = () => {
  const { productId } = useParams(); // Extract productId from URL params
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details from the API
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${SERVER_ENDPOINT}/v1/admin/products/${productId}`, {
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
        });

        const data = await response.json();
        console.log("data is ", data.product)
        if (data.success) {
          setProductInfo(data.product);
        } else {
          setError("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("An error occurred while fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error || !productInfo) {
    return <div>{error || "Product not found"}</div>;
  }

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Manage Products", href: "/admin/manage" },
    { label: productInfo.name, href: `/admin/manage/${productId}` },
  ];

  return (
    <div>
      <Header>
        <BreadCrumbs crumbs={breadcrumbs}></BreadCrumbs>
        <ManageProductDetailsPageComponent productInfo={productInfo}></ManageProductDetailsPageComponent>
      </Header>
    </div>
  );
};