const { SavedgameModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

exports.handler = async function(event, context) {
  const { headers } = event;
  const user = await validateJWT(headers.Authorization); // Assuming validateJWT decodes the token and returns user

  if (!user) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    let savedGames = [];
    if (user.role === "user") {
      savedGames = await SavedgameModel.findAll({
        where: { owner: user.id },
      });
    } else if (user.role === "admin") {
      savedGames = await SavedgameModel.findAll();
    }
    return {
      statusCode: 200,
      body: JSON.stringify(savedGames),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
