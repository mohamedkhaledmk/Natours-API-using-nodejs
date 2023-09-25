const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/Tour');
dotenv.config();

console.log(process.env.PORT);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log('DATABASE CONNECTED SUCCESSFULLY 💚💚');
  });

//Read File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
//Import data to db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded into db');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
