import Users from "../models/Users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UsersService {
    createUser = async (username, password) => {
        const user = new Users({
            username: username,
            password: bcrypt.hashSync(password, 8),
            logged_in: true,
        });

        await user.save();

        return user;
    };

    createTempUser = async (username) => {
        const user = new Users({
            username: username,
            password: "temp_password",
            logged_in: false,
        });

        await user.save();
        return user;
    };

    deleteTempUser = async (id) => {
        try {
            const user = await Users.findById(id);
            if (!user) {
                throw {
                    status: 404,
                    message: "User not found",
                };
            }
            if (!user.logged_in) {
                return await Users.findOneAndDelete({ _id: id });
            } else {
                throw new Error("Non-temp user could not be deleted");
            }
        } catch (e) {
            throw e;
        }
    };

    signIn = async (username, password) => {
        const user = await Users.findOne({
            username: username,
        });

        if (!user) {
            throw {
                status: 400,
                message: "Invalid username/password combination",
            };
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            throw {
                status: 400,
                message: "Invalid username/password combination",
            };
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400,
        });

        return { id: user._id, username: user.username, accessToken: token };
    };

    getUserByID = async (id) => {
        try {
            const user = await Users.findOne({
                _id: id,
            });

            if (!user) {
                throw {
                    status: 404,
                    message: "User not found",
                };
            }

            const userDetails = {
                id: user._id,
                username: user.username,
                loggedIn: user.logged_in,
            };

            return userDetails;
        } catch (error) {
            throw error;
        }
    };
}
