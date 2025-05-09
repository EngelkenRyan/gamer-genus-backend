const Sequelize = require('sequelize');

// Use environment variables for database URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ssl: {
        require: true,
        rejectUnauthorized: false, // Necessary for Heroku or some environments
    },
});

module.exports = sequelize;
