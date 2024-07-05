import Users from "../models/Users.model.js";
import bcrypt from "bcrypt";

export default class UsersService {
    createUser = async (data) => {
        const user = new Users({
            username: data.username,
            password: bcrypt.hashSync(data.password, 8),
            logged_in: true,
        });

        await user.save();

        const createdUser = await Users.findOne({
            username: data.username,
        });

        return createdUser;
    };

    createTempUser = async (data) => {
        const user = new Users({
            username: data.username,
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
                throw new Error("User not found");
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

    getUserByID = async (id) => {
        try {
            const user = await Users.findOne({
                _id: id,
            });
            if (user) {
                const userDetails = {
                    id: user._id,
                    username: user.username,
                    loggedIn: user.logged_in,
                };
                return userDetails;
            } else throw new Error("Could not find matching user");
        } catch (error) {
            throw error;
        }
    };
}
