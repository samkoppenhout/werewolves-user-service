import Users from "../models/Users.model.js";
import UsersService from "../services/Users.service.js";

export default class UsersController {
    #service;

    constructor(service = new UsersService()) {
        this.#service = service;
    }

    signUp = async (req, res) => {
        try {
            if (!req.body.username) {
                return res.status(400).json({ message: "Username invalid" });
            }
            if (!req.body.password) {
                return res.status(400).json({ message: "Password invalid" });
            }

            await this.#service.createUser(
                req.body.username,
                req.body.password
            );

            res.status(201).json({
                message: "User was registered successfully",
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message || "An error occurred",
            });
        }
    };

    createTempUser = async (req, res) => {
        try {
            if (!req.body.username) {
                return res.status(400).json({ message: "Username invalid" });
            }

            const createdUser = await this.#service.createTempUser(
                req.body.username
            );

            return res.status(201).json({
                id: createdUser._id,
                username: createdUser.username,
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message || "An error occurred",
            });
        }
    };

    deleteTempUser = async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Invalid ID" });

            const user = await this.#service.deleteTempUser(id);

            if (!user)
                return res.status(404).json({ message: "User not found" });

            res.status(202).json(user);
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message || "An error occurred",
            });
        }
    };

    signIn = async (req, res) => {
        try {
            if (!req.body.username || !req.body.password) {
                return res
                    .status(400)
                    .json({ message: "Invalid username/password combination" });
            }

            const user = await this.#service.signIn(
                req.body.username,
                req.body.password
            );

            return res.status(200).json(user);
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message || "An error occurred",
            });
        }
    };

    getUserByID = async (req, res) => {
        try {
            const userID = req.params.id;
            if (!userID) return res.status(400).json({ message: "Invalid ID" });

            const user = await this.#service.getUserByID(userID);

            if (!user)
                return res.status(404).json({ message: "User not found" });

            return res.status(202).json(user);
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message || "An error occurred",
            });
        }
    };
}
