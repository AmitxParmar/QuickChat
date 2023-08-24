import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL, (err, data) => {
    if (err) {
      console.log(err.message);
      console.log("Could not connect to database");
    } else {
      console.log("Connected to database");
    }
    // eslint-disable-next-line prettier/prettier
  });
};

module.exports = connectDB;
