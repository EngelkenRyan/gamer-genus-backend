const { ReviewModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

// Lambda function to create a new review
exports.handler = async function(event, context) {
  const { body, headers } = event;

  // Validate JWT Token
  const user = await validateJWT(headers.Authorization); 

  if (!user || (user.role !== "admin" && user.role !== "user")) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  // Parse request body
  const { gametitle, gameimage, date, feedback, rating } = JSON.parse(body);
  const reviewEntry = {
    gametitle,
    gameimage,
    date,
    feedback,
    rating,
    owner: user.id,
  };

  // Create new review entry
  try {
    const newReview = await ReviewModel.create(reviewEntry);
    return {
      statusCode: 200,
      body: JSON.stringify(newReview),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
