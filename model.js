const {DataTypes}  = require('sequelize'); // Import DataTypes from sequelize for defining model attributes
const sequelize = require("./db.js"); // Import the sequelize instance configured with the database

// User model definition
const Users_Model = sequelize.define('users',  // Define the 'users' table/model
{
  user_id:  // Define a column for user ID
  {
    type: DataTypes.INTEGER, // Specify that this field is an integer
    primaryKey: true, // Set this field as the primary key
    autoIncrement: true // Enable auto-increment for the user ID
  },
  first_name : DataTypes.STRING, // Define a column for the user's first name
  last_name : DataTypes.STRING, // Define a column for the user's last name
  email : DataTypes.STRING, // Define a column for the user's email
  password : DataTypes.STRING, // Define a column for the user's password
});

// Items model definition
const Items_Model = sequelize.define('items',  // Define the 'items' table/model
  {
    item_id:  // Define a column for item ID
    {
      type: DataTypes.INTEGER, // Specify that this field is an integer
      primaryKey: true, // Set this field as the primary key
      autoIncrement: true // Enable auto-increment for the item ID
    },
    item_name : DataTypes.STRING, // Define a column for the item's name
    category : DataTypes.STRING, // Define a column for the item's category
    description : DataTypes.STRING, // Define a column for the item's description
  });

// Reviews model definition
const Reviews_Model = sequelize.define('reviews',  // Define the 'reviews' table/model
  {
    review_id:  // Define a column for review ID
    {
      type: DataTypes.INTEGER, // Specify that this field is an integer
      primaryKey: true, // Set this field as the primary key
      autoIncrement: true // Enable auto-increment for the review ID
    },
    item_id : DataTypes.INTEGER, // Define a column for the related item's ID
    user_id : DataTypes.INTEGER, // Define a column for the user ID who made the review
    review : DataTypes.STRING, // Define a column for the review text
    rating: DataTypes.INTEGER // Define a column for the review rating
  });

// Comments model definition
const Comments_Model = sequelize.define('comments',  // Define the 'comments' table/model
    {
      comment_id:  // Define a column for comment ID
      {
        type: DataTypes.INTEGER, // Specify that this field is an integer
        primaryKey: true, // Set this field as the primary key
        autoIncrement: true // Enable auto-increment for the comment ID
      },
      review_id : DataTypes.INTEGER, // Define a column for the related review's ID
      user_id : DataTypes.INTEGER, // Define a column for the user ID who made the comment
      comment : DataTypes.STRING // Define a column for the comment text
    });

// Export the defined models for use in other parts of the application
module.exports =  {Users_Model, Items_Model, Reviews_Model, Comments_Model}; 
