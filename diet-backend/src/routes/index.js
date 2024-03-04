import { Router } from 'express';
import auth from './auth.js';
import recipe from './recipe.js';
import water from './water.js';
import calorie from './calorie.js';
import dietList from './dietList.js';

const router = Router();

router.get('/', (req, res) => {
  res.end('hey');
});

router.use('/auth', auth);
router.use('/recipe', recipe);
router.use('/water', water);
router.use('/cal', calorie);
router.use('/list', dietList);

export default router;