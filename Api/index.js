const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const PORT = 8080 || process.env.PORT;
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

// const { Server } = require("socket.io");

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const categoryRoutes = require("./routes/categorey");
const productsRoutes = require("./routes/products");
const citiesRoutes = require("./routes/cities");
const supplierRoutes = require("./routes/supplier");
const storesRoutes = require("./routes/stores");
const moneyTreasuryRoutes = require("./routes/moneyTreasury");
const purchasesRoutes = require("./routes/purchases");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const favRoutes = require("./routes/fav");
const orderRoutes = require("./routes/order");
const withdrawReqRoutes = require("./routes/withdrawReq");
const SettingsRoutes = require("./routes/settings");
const DeliveryRoutes = require("./routes/delivery");
const MoneyTransfersRoutes = require("./routes/moneyTransfers");
const PosRoutes = require("./routes/pos");
const ReportRoutes = require("./routes/report");

app.use("/category", categoryRoutes);
app.use("/products", productsRoutes);
app.use("/cities", citiesRoutes);
app.use("/supplier", supplierRoutes);
app.use("/stores", storesRoutes);
app.use("/moneyTreasury", moneyTreasuryRoutes);
app.use("/purchase", purchasesRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/fav", favRoutes);
app.use("/order", orderRoutes);
app.use("/withdrawReq", withdrawReqRoutes);
app.use("/settings", SettingsRoutes);
app.use("/delivery", DeliveryRoutes);
app.use("/moneyTransfers", MoneyTransfersRoutes);
app.use("/pos", PosRoutes);
app.use("/reportes", ReportRoutes);

app.get("/", function (req, res) {
  const filePath = path.join(__dirname, "WelcomePage.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error loading the welcome page.");
      return;
    }
    res.send(data);
  });
});

// io.on("connection", (socket) => {
//   socket.on("ready", (data) => {
//     socket.broadcast.emit("Recieve_Message", data);
//   });
//   socket.on("Write_Message", (data) => {
//     socket.broadcast.emit("Write_Message_Others", data);
//     clearTimeout(socket.typingTimeout);
//     socket.typingTimeout = setTimeout(() => {
//       socket.broadcast.emit("Stop_Writing_Others", data);
//     }, 5000);
//   });

//   socket.on("new_messages", (data) => {
//     socket.broadcast.emit("unreadCount", data);
//   });

//   socket.on("disconnect", () => {
//     clearTimeout(socket.typingTimeout);
//   });
// });

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
