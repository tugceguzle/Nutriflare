import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addList } from "../../api";
import Alert from "../../components/Alert.js";
import { down } from "../Svg.js";

const AddList = () => {
  const { user_id } = useParams();
  const [submitMessage, setSubmitMessage] = useState("");
  const navigate = useNavigate();
  const submitButtonRef = useRef(null);
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);
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
        await addList(user_id, values);
        setSubmitMessage("Tarif başarı ile eklendi!");
        navigate("/admin/users");
      } catch (error) {
        const errorHtml = error.response.data;
        const errorMatch = errorHtml.match(/<pre>(.*?)<br>/);
        if (errorMatch && errorMatch[1]) {
          const errorMessage = errorMatch[1].trim();
          bag.setErrors({ general: errorMessage });
        }
        setSubmitMessage("Tarif Eklenemedi!");
      }
    },
  });
  const handleScrollToSubmit = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
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
          <button type="submit" ref={submitButtonRef} className="al-btn">
            Ekle
          </button>
        </div>
      </form>
      <div className="fixed bottom-8 right-4">
        <button onClick={handleScrollToSubmit} className="al-down">
          {down}
        </button>
      </div>
    </section>
  );
};

export default AddList;
