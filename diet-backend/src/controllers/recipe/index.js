import Recipe from "../../models/Recipes.js";

const addRecipe = async (req, res, next) => {
  const input = req.body;
  try {
    const recipe = new Recipe(input);
    const data = await recipe.save();
    const recipeData = data.toObject();

    res.json({
      recipe: recipeData,
    });
  } catch (e) {
    next(e);
  }
};

const getAllRecipes = async (req, res, next) => {
  try {
    const allrecipes = await Recipe.find({});
    res.json(allrecipes);
  } catch (e) {
    next(e);
  }
};

const getRecipe = async (req, res, next) => {
  const { recipe_id } = req.params;

  if (!recipe_id) {
    console.log("Tarif bulunamadı");
  }

  try {
    const recipe = await Recipe.findById(recipe_id);

    res.json(recipe);
  } catch (e) {
    next(e);
  }
};

const Update = async (req, res, next) => {
  const { recipe_id } = req.params;

  try {
    const updated = await Recipe.findByIdAndUpdate(recipe_id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { recipe_id } = req.params;

  try {
    const deleted = await Recipe.findByIdAndDelete(recipe_id);

    if (!deleted) {
      console.log("Silinemedi");
    }

    res.json(deleted);
  } catch (e) {
    next(e);
  }
};

export default { getAllRecipes, getRecipe, addRecipe, Update, Delete };
