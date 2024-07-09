import Users from "../models/Users.model.js";

const checkDuplicateUsername = async (req, res, next) => {
    try {
        const userByUsername = await Users.findOne({
            username: req.body.username,
        });
        if (userByUsername) {
            return res.status(400).json({
                message: `Could not create user: Username already in use!`,
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default checkDuplicateUsername;
