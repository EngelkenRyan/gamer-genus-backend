const { ReviewModel } = require("../models");

exports.handler = async function(event, context) {
  try {
    const entries = await ReviewModel.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(entries),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
