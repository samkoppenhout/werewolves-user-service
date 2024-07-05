import { validationResult } from "express-validator";

const signInErrorCatch = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error("Validation failed");
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        next();
    } catch (err) {
        console.log(err);
        res.status(err.statusCode ?? 500).send({ message: err.data });
    }
};

export default signInErrorCatch;
