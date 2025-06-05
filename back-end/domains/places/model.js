import { Schema, model } from 'mongoose';

const placeSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
  },
  city: {
    type: String,
  },
  photos: {
    type: [String],
  },
  description: {
    type: String,
  },
  extras: {
    type: String,
  },
  perks: {
    type: [String],
  },
  price: {
    type: Number,
  },
  checkin: {
    type: String,
  },
  checkout: {
    type: String,
  },
  guests: {
    type: Number,
  },
});

export default model('Place', placeSchema);
