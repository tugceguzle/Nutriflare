import express from 'express';
import water from '../controllers/water-cal/water.js';

const router = express.Router();

router.get('/:user_id', water.getWaters);
router.post('/add', water.addWater);

export default router;