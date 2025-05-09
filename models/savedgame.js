const { DataTypes } = require("sequelize")
const db = require("../db")

const Savedgame = db.define("savedgame", {
    gametitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.INTEGER
    }
})

module.exports = Savedgame