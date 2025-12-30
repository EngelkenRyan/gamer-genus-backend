const { ReviewModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

// Lambda function to update a review entry
exports.handler = async function(event, context) {
  const { body, headers } = event;
  const reviewId = event.pathParameters.feedbackId;  

  //  Validate JWT Token
  const user = await validateJWT(headers.Authorization); 
  if (!user) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  // Parse request body
  const { gametitle, date, feedback, rating } = JSON.parse(body);
  const updatedReview = { gametitle, date, feedback, rating };

  const query = {
    where: {
      id: reviewId,
      owner: user.id,
    }
  };
  //  Update review entry
  try {
    const [updatedCount] = await ReviewModel.update(updatedReview, query);
    if (updatedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Review not found or you're not authorized to edit this review" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Review updated successfully" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
