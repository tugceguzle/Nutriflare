import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CalorieTableSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  caloriesConsumed: {
    type: Boolean,
    default: false
  },
  caloriesBurned: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
  },
  calorie_cal: {
    type: Number,
    required: true,
  },
});

const CalorieTable = mongoose.model('calorieTable', CalorieTableSchema);

export default CalorieTable;
