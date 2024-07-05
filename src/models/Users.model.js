import { Schema, model } from "mongoose";

const usersSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    logged_in: { type: Boolean, required: true },
});

const Users = model("users", usersSchema);

export default Users;
