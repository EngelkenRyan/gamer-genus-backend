const { ReviewModel } = require("../models");
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
    let userReviews = [];
    if (user.role === "user") {
      userReviews = await ReviewModel.findAll({
        where: { owner: user.id },
      });
    } else if (user.role === "admin") {
      userReviews = await ReviewModel.findAll();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(userReviews),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
