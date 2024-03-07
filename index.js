const dotenv = require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const path=require("path");

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database is not working"));

app.use(express.json());
const _dirname=path.dirname("");
const buildpath=path.join(_dirname,"../billing_frontend/build");
app.use(express.static(buildpath));
app.use(cors());

app.use('/account', require("./routes/accountUserRoutes"));
app.use('/', require("./routes/accountCreateRoutes"));
app.use('/transc', require("./routes/trnascationRoutes"));


const port = 2126;
app.listen(port, () => console.log(`Server is running on port ${port}`));
