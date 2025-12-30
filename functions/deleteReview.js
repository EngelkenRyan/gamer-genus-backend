const { ReviewModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

// Lambda function to delete a review
exports.handler = async function(event, context) {
  const { headers } = event;
  const reviewId = event.pathParameters.id; 

  // Validate JWT Token
  const user = await validateJWT(headers.Authorization); 
  if (!user) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  // Build query to delete review owned by the user
  const query = {
    where: {
      id: reviewId,
      owner: user.id,
    }
  };

  try {
    const deletedCount = await ReviewModel.destroy(query);
    if (deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Review not found or you're not authorized to delete this review" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Review entry removed" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
