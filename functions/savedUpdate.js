const { SavedgameModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

exports.handler = async function(event, context) {
  const { body, headers } = event;
  const user = await validateJWT(headers.Authorization); // Assuming validateJWT decodes the token and returns user
  const descriptionId = event.pathParameters.descriptionId;  // Get descriptionId from path parameters

  if (!user) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const { gametitle, genre, description, platform } = JSON.parse(body);
  const updatedSaved = { gametitle, genre, description, platform };
  const query = { where: { id: descriptionId, owner: user.id } };

  try {
    const [updatedCount] = await SavedgameModel.update(updatedSaved, query);
    if (updatedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Saved game not found or you're not authorized to edit this entry" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved game updated" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
