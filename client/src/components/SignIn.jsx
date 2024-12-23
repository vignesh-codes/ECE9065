import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_ENDPOINT } from "../assets/endpoints";

export const SignIn = () => {
  const [role, setRole] = useState("user"); // User role: admin or user
  const [isSignUp, setIsSignUp] = useState(false); // Toggle Sign In/Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setErrorMessage(""); // Clear previous errors
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }

        // Sign Up API call
        const response = await axios.post(`${SERVER_ENDPOINT}/v1/auth/signup`, {
          email,
          password,
          userType: role === "admin" ? 0 : 1, // UserType: 0 = Admin, 1 = User
        });

        const { message, success } = response.data;
        if (success) {
          alert(message);
          setIsSignUp(false); // Switch to Sign In mode
        }
      } else {
        // Login API call
        const response = await axios.post(`${SERVER_ENDPOINT}/v1/auth/login`, {
          email,
          password,
        });

        const { success, token, user } = response.data;
        if (success) {
          localStorage.setItem("token", token); // Store JWT token
          localStorage.setItem("usertype", user.userType); // Store user type
          // alert(message);
          console.log("navigating to ", user.userType)
          navigate(user.userType === 0 ? "/admin" : "/home");
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          {isSignUp
            ? "Please fill in the details to sign up."
            : "Please enter your details to sign in."}
        </p>
        <div className="w-3/4">
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          {/* Role Selection */}
          {isSignUp && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {isSignUp ? "Sign up as" : "Sign in as"}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md bg-white"
              >
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
          {/* Submit Button */}
          <button
            onClick={handleAuth}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-slate-800"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          {/* Toggle between Sign In/Sign Up */}
          <p className="text-sm text-center mt-4">
            {isSignUp ? (
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsSignUp(false)}
              >
                Already have an account? Sign In
              </span>
            ) : (
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsSignUp(true)}
              >
                Don&apos;t have an account? Sign Up
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative hidden lg:flex w-1/2 h-full items-center justify-center bg-black">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-200 via-fuchsia-200 to-pink-400 rounded-full animate-bounce"></div>
        <div className="w-full h-1/2 absolute bottom-0 backdrop-blur-lg"></div>
      </div>
    </div>
  );
};
