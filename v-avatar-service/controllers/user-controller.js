const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: "Authentication failed..!!",
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    message: "Authentication failed..!!",
                });
            }

            const token = jwt.sign(
                {
                    email: fetchedUser.email,
                    userId: fetchedUser._id,
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h",
                }
            );
            return res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Invalid authentication credentials!",
            });
        });
};

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });

        user
            .save()
            .then((resp) => {
                res.status(201).json({
                    message: "User Created",
                    result: resp,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Invalid authentication credentials!",
                });
            });
    });
};
