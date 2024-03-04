import Calorie from "../../models/Calorie.js";

const addCalorie = async (req, res, next) => {
  const input = req.body;

  try {
    const calorie = new Calorie(input);
    const data = await calorie.save();
    const calorieData = data.toObject();

    res.json({
      calorie: calorieData,
    });
  } catch (e) {
    next(e);
  }
};

const getCalories = async (req, res, next) => {
  const { user_id } = req.params;
  if (!user_id) {
    return next(Boom.badRequest("Missing paramter (:product_id)"));
  }
  try {
    const allcalories = await Calorie.find({ user_id: user_id });
    res.json(allcalories);
  } catch (e) {
    next(e);
  }
};

export default { getCalories, addCalorie };
