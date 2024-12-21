const mongoose = require('mongoose');
const { DATABASE_URL } = require('../constants/app.constant');

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Database Connected Successfully');
  } catch (error) {
    console.error('💥 Error connecting to the database : ', error);
  }
};
export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ Database Disconnected Successfully');
  } catch (error) {
    console.error('💥 Error disconnecting from the database: ', error);
  }
};
