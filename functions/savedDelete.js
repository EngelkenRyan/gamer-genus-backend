const { SavedgameModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

exports.handler = async function(event, context) {
  const { headers } = event;
  const user = await validateJWT(headers.Authorization); // Assuming validateJWT decodes the token and returns user
  const descriptionId = event.pathParameters.id;  // Get ID from path parameters

  if (!user) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const query = { where: { id: descriptionId, owner: user.id } };

  try {
    const deletedCount = await SavedgameModel.destroy(query);
    if (deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Saved game not found or you're not authorized to delete this entry" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved game deleted" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
