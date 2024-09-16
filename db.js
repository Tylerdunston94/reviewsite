// Import the configuration settings from the config file
const config = require("./config/config.js");

// Import Sequelize ORM from the sequelize package
const { Sequelize } = require('sequelize');

// Create a Sequelize instance to connect to the database using configurations
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST, // Database host address
  dialect: 'mysql', // Specify the database dialect (MySQL)
  port: config.PORT, // Database port number
  define: {
    timestamps: false // Disable automatic timestamps for createdAt and updatedAt fields
  }
});

// Validate the connection to the database and authenticate
sequelize
    .authenticate() // Attempt to authenticate the connection
    .then(() => console.log('Successfully connected to the database!')) // Log success message if connected
    .catch((error) => console.log('Failed to connect to the database:', error)) // Log error message if authentication fails

// Export the sequelize instance for use in other modules
module.exports = sequelize;

