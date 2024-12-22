import mongoose, { Connection } from 'mongoose';
import { DATABASE_URL } from '../constants/app.constant';

let cachedConnection: Connection | null = null;

export const connectToDatabase = async () => {
  if (cachedConnection) return cachedConnection;
  try {
    const cnx = await mongoose.connect(DATABASE_URL);
    cachedConnection = cnx.connection;
    console.log('✅ Database connected successfully');
    return cachedConnection;
  } catch (error) {
    console.error('💥 Error connecting to the database: ', error);
    throw new Error('Failed to connect to database');
  }
};
