const UserModel = require("./user")
const ReviewModel = require("./review")
const SavedgameModel = require("./savedgame")

UserModel.hasMany(ReviewModel);
UserModel.hasMany(SavedgameModel);

ReviewModel.belongsTo(UserModel);

SavedgameModel.belongsTo(UserModel);



module.exports = { 
    UserModel,
    ReviewModel,
    SavedgameModel
} 