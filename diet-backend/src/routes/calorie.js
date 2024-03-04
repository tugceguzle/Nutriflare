import express from 'express';
import calorie from '../controllers/water-cal/calorie.js';

const router = express.Router();

router.get('/cals/:user_id', calorie.getCalories);
router.post('/add', calorie.addCalorie);


export default router;