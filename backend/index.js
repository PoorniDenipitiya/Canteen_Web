const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoute = require("./Routes/AuthRoute");
const cartRoute = require("./Routes/CartRoute");
const { MONGO_URL } = process.env;



mongoose.set('strictQuery', true);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

const config = require("./config/loadConfig");
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);
app.use(cookieParser());

app.use(express.json());

const payhereRoutes = require('./Routes/payhere');
app.use('/api/payhere', payhereRoutes);

const orderRoute = require("./Routes/OrderRoute");
app.use("/", orderRoute);

app.use("/", authRoute);
app.use("/", cartRoute);

const complaintRoute = require('./Routes/ComplaintRoute');
app.use('/api/complaints', complaintRoute);

const favoriteRoute = require('./Routes/FavoriteRoute');
app.use('/api/favorites', favoriteRoute);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});