const mongoose = require('mongoose');
require('dotenv').config();

async function checkUser() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travelgo');
  const User = mongoose.model('User', new mongoose.Schema({ email: String }));
  const user = await User.findOne({ email: 'princelakhani74@gmail.com' });
  console.log('User found:', user);
  process.exit();
}

checkUser();
