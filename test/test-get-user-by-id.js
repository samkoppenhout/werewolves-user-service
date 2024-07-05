import axios from "axios";

const url = "http://localhost:3001/users/getuser/667a9b124a2e0e354ee072ab";
const data = {};

axios
    .get(url, data, {
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
