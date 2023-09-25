const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

console.log(process.env.PORT);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log('DATABASE CONNECTED SUCCESSFULLY 💚💚');
  });

// 4) START THE SERVER
// console.log(process.env);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`APP running on PORT ${PORT}.....`);
});
