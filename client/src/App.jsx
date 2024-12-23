// eslint-disable-next-line no-unused-vars
import { Home, AccessoriesPage, Cart, ProductDetailsPage, AdminPage, ManageProductsPage, ProductsPage, ManageProductsDetailsPage, CompletedOrdersPage } from "./components/Main";
import { SignIn } from "./components/SignIn";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


import React from "react";

// Utility function to check authentication and user type
const isAuthenticated = () => !!localStorage.getItem("token");
const getUserType = () => localStorage.getItem("usertype");

const ProtectedRoute = ({ children, requiredUserType }) => {
  // Check if the user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // Check if the user has the correct type
  if (
    requiredUserType &&
    String(getUserType()) !== String(requiredUserType) // Ensure string comparison
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <div className="overflow-x-hidden antialiased">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>

        <Routes>
          {/* Public Route */}
          <Route path="/" element={<SignIn />} />

          {/* User Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute requiredUserType="1">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute requiredUserType="1">
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accessories"
            element={
              <ProtectedRoute requiredUserType="1">
                <AccessoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredUserType="1">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredUserType="1">
                <CompletedOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <ProtectedRoute requiredUserType="1">
                <ProductDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredUserType="0">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <ProtectedRoute requiredUserType="0">
                <ManageProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage/:productId"
            element={
              <ProtectedRoute requiredUserType="0">
                <ManageProductsDetailsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
