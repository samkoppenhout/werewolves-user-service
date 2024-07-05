import axios from "axios";

const url = "http://localhost:3001/users/deletetemp/6679435f3203ee0c5d1d7c8c";
const data = {
    username: "sam",
};

axios
    .delete(url, data, {
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
