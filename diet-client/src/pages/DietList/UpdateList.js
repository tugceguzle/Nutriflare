import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateList, fetchDietList } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading.js";
import Alert from "../../components/Alert.js";

function UpdateList() {
  const [submitMessage, setSubmitMessage] = useState("");
  const { user_id } = useParams();
  const {
    isFetching,
    error,
    data: dietlist,
  } = useQuery({
    queryKey: ["dietlist", user_id],
    queryFn: () => fetchDietList(user_id),
  });
  const meal = {
    morningMeal: { totalCalories: 0, foods: [] },
    snack: { totalCalories: 0, foods: [] },
    lunch: { totalCalories: 0, foods: [] },
    snack2: { totalCalories: 0, foods: [] },
    dinner: { totalCalories: 0, foods: [] },
  };
  const formik = useFormik({
    initialValues: {
      user_id: user_id,
      days: {
        Monday: meal,
        Tuesday: meal,
        Wednesday: meal,
        Thursday: meal,
        Friday: meal,
        Saturday: meal,
        Sunday: meal,
      },
    },
    onSubmit: async (values, bag) => {
      try {
        await updateList(user_id, values);
        console.log(values, user_id);
        setSubmitMessage("Diyet listesi başarı ile güncellendi!");
      } catch (error) {
        const errorHtml = error.response.data;
        const errorMatch = errorHtml.match(/<pre>(.*?)<br>/);
        if (errorMatch && errorMatch[1]) {
          const errorMessage = errorMatch[1].trim();
          console.log(errorMessage);
          bag.setErrors({ general: errorMessage });
        }
        setSubmitMessage("Diyet Listesi Güncellenemedi!");
      }
    },
  });

  useEffect(() => {
    if (!isFetching && dietlist && dietlist.days) {
      formik.setValues({
        user_id: user_id,
        days: Object.keys(dietlist.days).reduce((acc, day) => {
          acc[day] = {
            morningMeal: {
              totalCalories: dietlist.days[day].morningMeal.totalCalories,
              foods: dietlist.days[day].morningMeal.foods,
            },
            snack: {
              totalCalories: dietlist.days[day].snack.totalCalories,
              foods: dietlist.days[day].snack.foods,
            },
            lunch: {
              totalCalories: dietlist.days[day].lunch.totalCalories,
              foods: dietlist.days[day].lunch.foods,
            },
            snack2: {
              totalCalories: dietlist.days[day].snack2.totalCalories,
              foods: dietlist.days[day].snack2.foods,
            },
            dinner: {
              totalCalories: dietlist.days[day].dinner.totalCalories,
              foods: dietlist.days[day].dinner.foods,
            },
          };
          return acc;
        }, {}),
      });
    }
  }, [isFetching, dietlist, formik.setValues, user_id]);

  if (isFetching) return <Loading />;

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <section className="al-sec">
        {submitMessage && <Alert description={submitMessage} />}
        <h2 className="al-h">Haftalık Diyet Listesi</h2>
        <form onSubmit={formik.handleSubmit}>
          {Object.keys(formik.values.days).map((day) => (
            <div key={day} className="mb-12">
              <h3 className="al-h-three">{day === "Monday" ? "Pazartesi" : day === "Tuesday" ? "Salı" : day === "Wednesday" ? "Çarşamba" : day === "Thursday" ? "Perşembe" : day === "Friday" ? "Cuma" : day === "Saturday"  ? "Cumartesi" : "Pazar"}</h3>
              <div className="al-grid">
                {Object.keys(formik.values.days[day]).map((meal) => (
                  <div key={meal} className="al-meal-div">
                    <h4 className="al-h-four">{meal ==="morningMeal" ? "Kahvaltı" : meal ==="snack"? "Ara Öğün - 1" : meal ==="lunch" ? "Öğle Yemeği" : meal==="snack2" ? "Ara Öğün - 2" : "Akşam Yemeği"}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="mb-2">
                        <label
                          className="text-gray-700"
                          htmlFor={`${day}-${meal}-calories`}
                        >
                          Kalori:
                          <input
                            type="number"
                            id={`${day}-${meal}-calories`}
                            value={formik.values.days[day][meal].totalCalories}
                            onChange={(e) =>
                              formik.setFieldValue(
                                `days.${day}.${meal}.totalCalories`,
                                e.target.value
                              )
                            }
                            className="al-input"
                          />
                        </label>
                      </div>
                      <div className="flex-grow">
                        <label className="text-gray-700">Yiyecekler:</label>
                        {formik.values.days[day][meal].foods.map(
                          (food, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={food}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `days.${day}.${meal}.foods[${index}]`,
                                    e.target.value
                                  )
                                }
                                className="al-food-input"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  formik.setFieldValue(
                                    `days.${day}.${meal}.foods`,
                                    formik.values.days[day][meal].foods.filter(
                                      (_, i) => i !== index
                                    )
                                  )
                                }
                                className="text-red-500 focus:outline-none"
                              >
                                &#x2715;
                              </button>
                            </div>
                          )
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            formik.setFieldValue(`days.${day}.${meal}.foods`, [
                              ...formik.values.days[day][meal].foods,
                              "",
                            ])
                          }
                          className="al-food"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end items-end">
            <button type="submit" className="al-btn">
              Güncelle
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default UpdateList;
