import axios from "axios";

const url = "http://localhost:3001/users/signup";
const data = {
    username: "samm",
    password: "jebbidy3",
};

axios
    .post(url, data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        console.log("Response:", response.data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
