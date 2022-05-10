const mongoose = require('mongoose');

const database = async () => {
  await mongoose
    .connect(process.env.MONGODB_LOCAL_URL)
    .then(() => console.log('connection ready'))
    .catch((error) => console.log(error));
};

module.exports = database;
