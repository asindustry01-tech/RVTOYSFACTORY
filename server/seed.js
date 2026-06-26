const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteOne({ employeeId: 'RV-ADMIN' });
  await User.create({
    employeeId: 'RV-ADMIN',
    name: 'Rajesh Vishwakarma',
    password: 'rvtoys@2024',
    phone: '+91 8358938745',
    email: 'rvtoysfactory@gmail.com',
    role: 'admin',
  });
  console.log('✅ Admin created: RV-ADMIN / rvtoys@2024');
  process.exit(0);
}

seed().catch(console.error);
