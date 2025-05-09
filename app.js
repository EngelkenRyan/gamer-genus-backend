require("dotenv").config()
const Express = require("express");
const app = Express();
const dbConnection = require('./db')

app.use(require('./middleware/headers'))

const controllers = require("./controllers")

app.use(Express.json());

app.use("/user", controllers.userController)
app.use("/savedgame", controllers.savedgameController)

app.use(require("./middleware/validate-jwt"))
app.use("/review", controllers.reviewController)

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is listening on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`)
    })