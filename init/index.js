const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "66865eb93c0508ebf5d01cf1" })); //map properties ek new array create kr deta hai or uss array ko yaha init data ke under insert kr rhe.
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();

