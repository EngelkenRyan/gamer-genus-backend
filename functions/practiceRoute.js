exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hey!! This is a practice route!' }),
  };
};
