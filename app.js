// Importing the required libraries and modules
var express = require('express'); // Express framework for building web applications
var app = express(); // Creating an instance of an Express application

const sequelize = require("./db.js"); // Importing the database configuration and connection
const config = require("./config/config.js"); // Importing configuration settings
const bcrypt = require("bcrypt"); // Library for hashing passwords
const salt_rounds = 10; // Number of rounds for generating salt for password hashing
const jwt = require("jsonwebtoken"); // Library for generating and verifying JSON Web Tokens
const { Op } = require('sequelize'); // Op library from Sequelize for creating condition operators

// Importing database models for users, items, reviews, and comments
const {
    Users_Model,
    Items_Model,
    Reviews_Model,
    Comments_Model
} = require("./model.js");

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to authorize access tokens
function authorize() {
    return (req, res, next) => {
        const usertoken = req.headers.authorization; // Get the authorization header from the request

        if (usertoken == null) // Check if token is missing
            return res.status(403).json({ error: "Token not found" }); // Respond with an error if there's no token
        
        const token = usertoken.split(" "); // Split the token from the header
        const { success, message } = verifyAccessToken(token[1]); // Verify the token

        if (success) {
            const user_id = message.id; // Extract user_id from the decoded token
            if (user_id == null) // Check if user_id is invalid
                return res.status(403).json({ error: "Invalid token" }); // Respond with an error if invalid
            else {
                res.locals.user_id = user_id; // Store user_id in response locals for future use
                next(); // Proceed to the next middleware or route handler
            }
        } else {
            console.log(message); // Log error message
            return res.status(403).json({ error: message }); // Respond with the error message
        }
    };
}

// Support function to verify access token. Used in the authorize function
function verifyAccessToken(token) {
    try {
        const secret = config.JWT_SECRET; // Get the JWT secret from the config
        const decoded = jwt.verify(token, secret); // Verify the token against the secret
        return { success: true, message: decoded }; // Return success and decoded message
    } catch (error) {
        return { success: false, message: error.message }; // Return failure and error message
    }
}

// Route to handle user signup
app.post("/signup", async function (req, res) {
    let user = {}; // Initialize a user object to store user details
    user.first_name = req.body.first_name; // Store first name from request body
    user.last_name = req.body.last_name; // Store last name from request body
    user.email = req.body.email; // Store email from request body
    user.password = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(salt_rounds)); // Hash the password

    const created_client = await Users_Model.create(user); // Create a new user in the database
    delete created_client.password; // Remove password from the response
    res.send(created_client); // Send the created user back as response
});

// Route to handle user login
app.post("/login", async function (req, res) {
    const email = req.body.email; // Get email from request body
    const password = req.body.password; // Get password from request body
    const user = await Users_Model.findOne({ where: { email }}); // Find the user by email

    // If user not found
    if (!user) {
        return res.send("User not found"); // Respond if the user does not exist
    }

    // Verify the password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If password does not match
    if (!passwordMatch) {
        return res.send("Invalid credentials"); // Respond with an error for invalid credentials
    }

    delete user.dataValues.password; // Remove the password from the user object
    user.dataValues.jwt_token = await jwt.sign({ id: user.user_id}, config.JWT_SECRET, { expiresIn: "1h" }); // Generate a JWT token
    return res.send(user.dataValues); // Send user data along with the token as response
});

// Route to search for items using a search string
app.get("/item/search/:search", async function (req, res) {
    const search = '%' + req.params.search + "%"; // Create a search pattern with wildcards
