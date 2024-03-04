import Boom from "boom";
import DietList from "../../models/DietList.js";
import User from "../../models/User.js";

const addList = async (req, res, next) => {
  const input = req.body;
  const { user_id } = req.params;

  try {
    const dietList = new DietList(input, user_id);
    const data = await dietList.save();
    const listData = data.toObject();

    Object.values(listData.days).forEach((day) => {
      day.dailyTotalCalories = Object.values(day).reduce((total, meal) => {
        return total + (meal.totalCalories || 0);
      }, 0);
    });

    listData.weeklyTotalCalories = Object.values(listData.days).reduce(
      (total, day) => {
        return total + (day.dailyTotalCalories || 0);
      },
      0
    );
    const updatedData = await DietList.findByIdAndUpdate(
      data._id,
      {
        $set: {
          days: listData.days,
          weeklyTotalCalories: listData.weeklyTotalCalories,
        },
      },
      { new: true }
    );

    const user = await User.findById(user_id);

    if (user) {
      user.dietList = true;
      try {
        console.log(user);
        await user.save();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      console.log("User not found");
    }

    res.json({
      dietList: listData,
    });
  } catch (e) {
    next(e);
  }
};

const getList = async (req, res, next) => {
  const { user_id } = req.params;
  if (!user_id) {
    return next(Boom.badRequest("Missing paramter (:product_id)"));
  }

  try {
    const dietList = await DietList.findOne({ user_id: user_id });
    res.json(dietList);
  } catch (e) {
    next(e);
  }
};

const Update = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const oldData = await DietList.findOne({ user_id: user_id });

    if (!oldData) {
      return res.status(404).json({ error: "DietList not found." });
    }

    if (!oldData.days) {
      return res
        .status(400)
        .json({ error: "DietList is missing 'days' property." });
    }

    const updated = await DietList.findOneAndUpdate(
      { user_id: user_id },
      req.body,
      { new: true }
    );

    if (!updated.days) {
      return res
        .status(400)
        .json({ error: "Updated DietList is missing 'days' property." });
    }

    const updatedWithDailyTotal = await updated.save();
    Object.values(updatedWithDailyTotal.days).forEach((day) => {
      if (day) {
        day.dailyTotalCalories = Object.values(day).reduce((total, meal) => {
          return total + (meal.totalCalories || 0);
        }, 0);
      }
    });

    updatedWithDailyTotal.weeklyTotalCalories = Object.values(
      updatedWithDailyTotal.days
    ).reduce((total, day) => {
      return total + (day.dailyTotalCalories || 0);
    }, 0);

    const finalUpdatedData = await updatedWithDailyTotal.save();

    res.json({ oldData, updated: finalUpdatedData });
  } catch (e) {
    console.error("Error:", e);
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const data = await DietList.findOne({ user_id: user_id });
    const deleted = await DietList.findByIdAndDelete(data._id);

    if (!deleted) {
      console.log("Silinemedi");
    }

    const user = await User.findById(user_id);

    if (user) {
      user.dietList = false;
      try {
        await user.save();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      console.log("User not found");
    }

    res.json(deleted);
  } catch (e) {
    next(e);
  }
};

export default { getList, addList, Update, Delete };
