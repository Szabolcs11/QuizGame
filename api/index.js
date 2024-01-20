require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeSocket = require("./modules/socket");

const port = process.env.PORT || 80;

const corsOptions = {
  origin: process.env.APPURL,
  credentials: true,
};

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", require("./routes/auth/index"));
app.use("/lobby", require("./routes/lobby/index"));
app.use("/file-upload", require("./routes/lobby/index"));

app.use((req, res) => {
  res.send("404 Not Found");
});

const server = require("http").createServer(app);
const io = initializeSocket(server);

server.listen(port, () => {
  console.log("Server running " + port);
});
