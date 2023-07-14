// Express
import express from "express";
const app = express();
const port = 8080;
const host = "0.0.0.0";

// Utils
import __dirname from "./utils.js";

// Rutas
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import messagesRoute from "./routes/messages.router.js";
import cookiesRoute from "./routes/cookies.router.js";
import sessionsRoute from "./routes/sessions.router.js";

// Data
import products from "./data/products.json" assert { type: "json" };

// Mongoose
import mongoose from "mongoose";
import { messageModel } from "./dao/mongo/models/messages.model.js";
const enviroment = async () => {
  await mongoose.connect("mongodb+srv://martinposniak25:c5QHEsNZcNLmf6r8@pruebacoder.u9d7cxx.mongodb.net/?retryWrites=true&w=majority");
};
enviroment();

// Handlebars
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
app.use("/cookies", cookiesRoute);
app.use("/sessions", sessionsRoute);
app.use("/messages", messagesRoute);
app.use("/", viewsRoute);

// Socket & Server:
import { Server } from "socket.io";
const httpServer = app.listen(port, host, () => {
  console.log(`Server up on http://${host}:${port}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.emit("products", products);

  // Recibir usuarios, mensajes y crear entrada en DB:
  socket.on("user", async (data) => {
    await messageModel.create({
      user: data.user,
      message: data.message,
    });

    const messagesDB = await messageModel.find();
    io.emit("messagesDB", messagesDB);
  });

  socket.on("message", async (data) => {
    await messageModel.create({
      user: data.user,
      message: data.message,
    });

    const messagesDB = await messageModel.find();
    io.emit("messagesDB", messagesDB);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});
