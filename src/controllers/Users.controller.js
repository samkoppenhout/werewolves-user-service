import Users from "../models/Users.model.js";
import UsersService from "../services/Users.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export default class UsersController {
    #service;

    constructor(service = new UsersService()) {
        this.#service = service;
    }

    signup = async (req, res) => {
        try {
            await this.#service.createUser(req.body);
            res.send({ message: "User was registered successfully" });
            console.log("User created successfully!");
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    };

    createTemp = async (req, res) => {
        try {
            await this.#service.createTempUser(req.body);
            const createdUser = await Users.findOne({
                username: req.body.username,
            }).select("-__v");

            res.status(200).send({
                id: createdUser._id,
                username: createdUser.username,
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    };

    deleteTemp = async (req, res) => {
        console.log(req.params);
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Invalid id" });

            const user = await this.#service.deleteTempUser(id);

            if (!user)
                return res.status(404).json({ message: "User not found" });

            res.status(202).json(user);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };

    signin = async (req, res) => {
        try {
            const user = await Users.findOne({
                username: req.body.username,
            }).select("-__v");

            if (!user) {
                return res.status(404).send({ message: `User not found` });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid username/password combination",
                });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 86400,
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                accessToken: token,
            });
            console.log(`User "${user.username}" signed in successfully`);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err.message });
        }
    };

    getUserByID = async (req, res) => {
        try {
            const userID = req.params.id;
            !userID && res.status(400).json({ message: "Invalid ID" });

            const role = await this.#service.getUserByID(userID);

            !role && res.status(404).json({ message: "Role not found" });

            res.json(role);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}
