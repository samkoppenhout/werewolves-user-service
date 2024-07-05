import Config from "./config/Config.js";
import Database from "./db/Database.js";
import Server from "./server/Server.js";
import UsersRoutes from "./routes/Users.routes.js";

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const usersRoutes = new UsersRoutes();

const server = new Server(PORT, HOST, usersRoutes);
const database = new Database(DB_URI);

server.start();
database.connect();

console.log(process.env);
