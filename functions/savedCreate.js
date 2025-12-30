const { SavedgameModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

// Lambda function to create a new saved game entry
exports.handler = async function(event, context) {
  const { body, headers } = event;
  const user = await validateJWT(headers.Authorization); 
  // Validate JWT Token
  if (!user || (user.role !== "admin" && user.role !== "user")) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  // Parse request body
  const { gametitle, genre, description, platform } = JSON.parse(body);
  const { id } = user;

  // Build saved game entry
  const savedEntry = {
    gametitle,
    genre,
    description,
    platform,
    owner: id,
  };
  // Create new saved game entry
  try {
    const newSaved = await SavedgameModel.create(savedEntry);
    return {
      statusCode: 200,
      body: JSON.stringify(newSaved),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
