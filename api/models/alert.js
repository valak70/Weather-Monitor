import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperature: {
    value: { type: Number, required: true },
    condition: { type: String, enum: ['greater', 'less'], required: true },
  },
  email: { type: String, required: true },
  consecutiveTimes: { type: Number, required: true }
});

export default mongoose.model('Alert', alertSchema);

