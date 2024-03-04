import express from 'express';
import recipe from '../controllers/recipe/index.js';

const router = express.Router();

router.post('/add', recipe.addRecipe);
router.get('/recipes',recipe.getAllRecipes);
router.get('/:recipe_id', recipe.getRecipe);
router.put("/:recipe_id", recipe.Update);
router.delete("/:recipe_id", recipe.Delete);

export default router;