require('dotenv').config();
const mongoose = require('mongoose');

const mongoConnect = async () => {
  await mongoose
    .connect(process.env.MONGODB_LOCAL_URL)
    .then(() => console.log('connection ready'))
    .catch((error) => console.log(error));
};
const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { mongoConnect, mongoDisconnect };
