import 'dotenv/config';
import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conexão bem sucedida');
  } catch (error) {
    console.log('Conexão NÃO sucedida', error);
  }
};
