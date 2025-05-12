const { SavedgameModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

exports.handler = async function(event, context) {
  const { body, headers } = event;
  const user = await validateJWT(headers.Authorization); // Assuming validateJWT decodes the token and returns user
  
  if (!user || (user.role !== "admin" && user.role !== "user")) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const { gametitle, genre, description, platform } = JSON.parse(body);
  const { id } = user;

  const savedEntry = {
    gametitle,
    genre,
    description,
    platform,
    owner: id,
  };

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
