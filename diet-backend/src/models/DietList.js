import mongoose from "mongoose";
const Schema = mongoose.Schema;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealSchema = {
  totalCalories: { type: Number },
  foods: [{ type: String }],
};

const DietListSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  days: daysOfWeek.reduce((daysSchema, day) => {
    daysSchema[day] = {
      morningMeal: MealSchema,
      snack: MealSchema,
      lunch: MealSchema,
      snack2: MealSchema,
      dinner: MealSchema,
      dailyTotalCalories: { type: Number, default: 0 },
    };
    return daysSchema;
  }, {}),
  weeklyTotalCalories: { type: Number, default: 0 },
});


const DietList = mongoose.model('dietList', DietListSchema);

export default DietList;


