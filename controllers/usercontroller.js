const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    console.log("Incoming request body:", req.body);

    let { email, username, password, role } = req.body;

    // Validation for missing fields
    if (!email || !username || !password || !role) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        // Check if the email is already registered
        const existingUser = await UserModel.findOne({
            where: { email: email },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already in use",
            });
        }

        // If email is not taken, proceed with creating the user
        const User = await UserModel.create({
            email,
            username,
            password: bcrypt.hashSync(password, 14),
            role,
        });

        // Create JWT Token
        let token = jwt.sign(
            { id: User.id },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 * 12 }
        );

        res.status(200).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token,
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            message: "Failed to register user",
            error: err.message,
        });
    }
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
        const loginUser = await UserModel.findOne({
            where: { email: email },
        });

        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {
                let token = jwt.sign(
                    { id: loginUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 60 * 60 * 12 }
                );

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token,
                });
            } else {
                res.status(401).json({
                    message: "Username or password is incorrect or account doesn't exist", // Updated message
                });
            }
        } else {
            res.status(401).json({
                message: "Username or password is incorrect or account doesn't exist", // Same message for consistency
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Failed to log user in",
        });
    }
});

module.exports = router;
    