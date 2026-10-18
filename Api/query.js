const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Type = require("./models/withdrawReq");

const deleteData = async () => {
  try {
    await connectDB();
    await Type.deleteMany({});
    console.log("-ˏˋ⋆ S U C S S E S ⋆ˊˎ-");
    process.exit();
  } catch (err) {
    console.error("Failed to delete data", err);
    process.exit(1);
  }
};

deleteData();
