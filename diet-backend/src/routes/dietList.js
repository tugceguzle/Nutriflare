import express from 'express';
import dietlist from '../controllers/dietList/index.js';

const router = express.Router();

router.get('/:user_id', dietlist.getList);
router.post('/add/:user_id', dietlist.addList);
router.put("/update/:user_id", dietlist.Update);
router.delete("/:user_id", dietlist.Delete);

export default router;