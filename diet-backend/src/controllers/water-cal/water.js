import Water from "../../models/Water.js";

const addWater= async (req, res, next) => {
    const input = req.body;
    try {
      const water = new Water(input);
      const data = await water.save();
      const waterData = data.toObject();
  
      res.json({
        water: waterData,
      });
    } catch (e) {
      next(e);
    }
  };
  
const getWaters = async (req, res, next) => {
  const { user_id } = req.params;
  if (!user_id) {
    return next(Boom.badRequest("Missing paramter (:product_id)"));
  }
  try {
    const allwaters = await Water.find({user_id: user_id});
    res.json(allwaters);
  } catch (e) {
    next(e);
  }
};

  export default { addWater , getWaters};
  