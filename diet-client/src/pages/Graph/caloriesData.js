export function calculateCalories(caloriesList) {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const todayCalories = caloriesList.filter((calorie) => {
      const createdAtDate = new Date(calorie.createdAt);
      createdAtDate.setHours(0, 0, 0, 0);
      return createdAtDate.getTime() === today.getTime();
    });
  
    const consumedCalories = todayCalories
      .filter((calorie) => calorie.caloriesConsumed === true)
      .reduce((total, calorie) => total + parseInt(calorie.calorie_cal, 10), 0);
  
    const burnedCalories = todayCalories
      .filter((calorie) => calorie.caloriesBurned === true)
      .reduce((total, calorie) => total + parseInt(calorie.calorie_cal, 10), 0);
  
    return { consumedCalories, burnedCalories };
  }
  