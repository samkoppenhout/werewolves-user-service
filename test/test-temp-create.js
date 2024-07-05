import axios from "axios";

const url = "http://localhost:3001/users/createtemp";
const data = {
    username: "sam",
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
