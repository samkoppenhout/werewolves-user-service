import { validationResult } from "express-validator";

const signInErrorCatch = (req, res, next) => {
    try {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            const err = new Error("Validation failed");
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        next();
    } catch (err) {
        res.status(err.statusCode ?? 500).json({ message: err.data });
    }
};

export default signInErrorCatch;
