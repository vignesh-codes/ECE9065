const jwt = require("jsonwebtoken");
const constants = require('../constants/constants'); // Assuming you have constants.js for JWT_SECRET

// JWT Validation Middleware
const jwtValidator = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token provided", success: false });
        }

        const decoded = jwt.verify(token, constants.JWT_SECRET);

        req.user = decoded; 

        next();
    } catch (err) {
        console.error("JWT validation error:", err);
        return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
};

// JWT Validation Middleware
const checkIfAdmin = (req, res, next) => {
    try {
        if (req.user.userType != 0) {
            return res.status(403).json({ message: "Access denied. Only admins can access this route.", success: false });
        }
        next();
    } catch (err) {
        console.error("JWT validation error:", err);
        return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
};

const checkIfUser = (req, res, next) => {
    try {
        if (req.user.userType != 1) {
            return res.status(403).json({ message: "Access denied. Only users can access this route.", success: false });
        }
        next();
    } catch (err) {
        console.error("JWT validation error:", err);
        return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
};



module.exports = { jwtValidator, checkIfAdmin, checkIfUser };
