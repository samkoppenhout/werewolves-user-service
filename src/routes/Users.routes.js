import { Router } from "express";
import { body } from "express-validator";
import checkDuplicateUsername from "../middleware/checkDuplicateUsername.js";
import UsersController from "../controllers/Users.controller.js";
import signInErrorCatch from "../middleware/signInErrorCatch.js";

export default class UsersRoutes {
    #controller;
    #router;
    #routeStartPoint;

    constructor(controller = new UsersController(), routeStartPoint = "/") {
        this.#controller = controller;
        this.#routeStartPoint = routeStartPoint;
        this.#router = Router();
        this.#initialiseRoutes();
    }

    #initialiseRoutes = () => {
        this.#router.post(
            `/users/signup`,
            [
                body("username")
                    .exists()
                    .withMessage("Username is required.")
                    .trim()
                    .escape(),
                body("password")
                    .exists()
                    .withMessage("Password is required.")
                    .trim()
                    .escape(),
                checkDuplicateUsername,
            ],
            signInErrorCatch,
            this.#controller.signUp
        );
        this.#router.post(
            `/users/createtemp`,
            [
                body("username")
                    .exists()
                    .withMessage("Username is required.")
                    .trim()
                    .escape(),
                checkDuplicateUsername,
            ],
            signInErrorCatch,
            this.#controller.createTempUser
        );
        this.#router.post(
            `/users/signin`,
            [
                body(`username`)
                    .exists()
                    .withMessage("Username is required.")
                    .escape(),
                body(`password`)
                    .exists()
                    .withMessage("Password is required.")
                    .escape(),
            ],
            signInErrorCatch,
            this.#controller.signIn
        );
        this.#router.delete(
            `/users/deletetemp/:id`,
            this.#controller.deleteTempUser
        );
        this.#router.get(`/users/getuser/:id`, this.#controller.getUserByID);
    };

    getRouter = () => {
        return this.#router;
    };

    getRouteStartPoint = () => {
        return this.#routeStartPoint;
    };
}
