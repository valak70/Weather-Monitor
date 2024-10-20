
import mongoose from 'mongoose'

const alertCountSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  city : {type : String, required : true},
  count: { type: Number, default: 0 },
});

alertCountSchema.index({ city: 1, date: 1 }, { unique: true });

export default mongoose.model('AlertCount', alertCountSchema);
