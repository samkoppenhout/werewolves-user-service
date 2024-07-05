import Users from "../models/Users.model.js";

const checkDuplicateUsername = async (req, res, next) => {
    try {
        const userByUsername = await Users.findOne({
            username: req.body.username,
        }).exec();
        if (userByUsername) {
            return res.status(400).send({
                message: `Could not create user: Username already in use!`,
            });
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export default checkDuplicateUsername;
