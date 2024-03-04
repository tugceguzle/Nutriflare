import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  preparationTime: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model('recipe', RecipeSchema);

export default Recipe;