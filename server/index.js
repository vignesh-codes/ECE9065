require('dotenv').config();  // Make sure the environment variables are loaded

const express = require("express");
const app = express();
const cors=require('cors');
const bodyParser=require('body-parser'); 

const router = require("./router/authRouters");
const adminRouter = require("./router/adminRouters")
const cartRouter = require("./router/cartRouters")
const productRouter = require("./router/productRouters")
const connectDB = require("./utlis/db");

// Middleware
app.use(express.json());  // Body parser to handle JSON requests
app.use(bodyParser.json());
app.use(cors());

// add api logger
const morgan = require('morgan');
app.use(morgan('combined'));

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the product Store API!");
});

// Register Routes
app.use("/v1/auth", router);  // Auth-related routes
app.use("/v1/admin/", adminRouter);
app.use("/v1/user/", cartRouter);
app.use("/v1/products/", productRouter);

// Start the server after connecting to the database
connectDB().then(() => {
    app.listen(5000, () => {
        console.log("Server is running at port: 5000");
    });
});
