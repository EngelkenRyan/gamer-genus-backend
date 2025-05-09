const { DataTypes } = require("sequelize")
const db = require("../db")

const Review = db.define("review", {
    gametitle: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    gameimage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    feedback: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    owner: {
        type: DataTypes.INTEGER
    }
})

module.exports = Review
