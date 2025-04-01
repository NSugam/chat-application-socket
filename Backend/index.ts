require('dotenv').config();
const express = require("express")
const app = express()
import routes from './src/routes';
const cors = require("cors")
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT

// Socket Server Imports
const { createServer } = require("http");
const { Server } = require("socket.io");

//Middleware Imports
const errorMiddleware = require('./src/middlewares/errorMiddleware')
const { checkAuth } = require('./src/middlewares/auth')

//DB Initialization
import { AppDataSource } from "./src/data-source"
import { initializeSocket } from './socket';
AppDataSource.initialize().then(() => console.log("Connected to Postgres")).catch(console.error);

//Middlewares
app.use(express.json())
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
app.use(cookieParser())
app.use(checkAuth)

app.listen(PORT, "0.0.0.0", () => {
    console.log("\n" + process.env.NODE_ENV, `Server Running OK @ ${PORT}...`);
});

// Create HTTP Server
const server = createServer(app)

// Initialize Socket
initializeSocket(server)

// all routes from routes/index.ts
app.use('/api', routes);

// global error handler
app.use(errorMiddleware)

export default app;
