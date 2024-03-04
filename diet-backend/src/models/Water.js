import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WaterSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  water_ml: {
    type: Number,
    required: true,
  },

});

const Water = mongoose.model('water', WaterSchema);

export default Water;
