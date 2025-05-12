const { ReviewModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

exports.handler = async function(event, context) {
  const { body, headers } = event;

  // Decode the JWT from headers (simulating validateJWT)
  const user = await validateJWT(headers.Authorization); // Assuming validateJWT decodes the token and returns user

  if (!user || (user.role !== "admin" && user.role !== "user")) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const { gametitle, gameimage, date, feedback, rating } = JSON.parse(body);
  const reviewEntry = {
    gametitle,
    gameimage,
    date,
    feedback,
    rating,
    owner: user.id,
  };

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
