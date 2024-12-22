import mongoose, { Connection } from 'mongoose';
import { DATABASE_URL } from '../constants/app.constant';

let cachedConnection: Connection | null = null;

export const connectToDatabase = async () => {
  try {
    if (cachedConnection) {
      return cachedConnection;
    }
    const cnx = await mongoose.connect(DATABASE_URL);
    cachedConnection = cnx.connection;
    return cachedConnection;
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
