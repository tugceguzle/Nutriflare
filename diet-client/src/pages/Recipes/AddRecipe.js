import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { addRecipe } from "../../api";
import Alert from "../../components/Alert.js";

const AddRecipe = () => {
  const [submitMessage, setSubmitMessage] = useState("");
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);
  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      description: "",
      preparationTime: 0,
      ingredients: [],
    },
    onSubmit: async (values, bag) => {
      try {
        await addRecipe({
          name: values.name,
          image: values.image,
          description: values.description,
          preparationTime: values.preparationTime,
          ingredients: values.ingredients,
        });
        setSubmitMessage("Tarif başarı ile eklendi!");
        formik.resetForm();
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

  const handleIngredientAdd = () => {
    if (formik.values.ingredients.length < 10) {
      formik.setFieldValue("ingredients", [...formik.values.ingredients, ""]);
    }
  };

  return (
    <section className="ar-sec">
      {submitMessage && <Alert description={submitMessage} />}
      <h2 className="ar-h">Tarif Ekle</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="ar-form">
          <div>
            <label className="text-gray-700" htmlFor="name">
              Tarif Adı:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="ur-input"
            />
          </div>
          <div>
            <label className="text-gray-700" htmlFor="image">
              Tarih Görseli:
              <input
                type="text"
                id="image"
                name="image"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.image}
                className="ur-input"
              />
            </label>
          </div>
          <div>
            <label className="text-gray-700" htmlFor="description">
              Tarif Detayı:
              <textarea
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="ur-input"
              />
            </label>
          </div>
          <div>
            <label className="text-gray-700" htmlFor="preparationTime">
              Hazırlama Süresi:
              <input
                type="number"
                id="preparationTime"
                name="preparationTime"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.preparationTime}
                className="ur-input"
              />
            </label>
          </div>
          <div>
            <label className="text-gray-700" htmlFor="ingredients">
              Malzemeler:
              {formik.values.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `ingredients[${index}]`,
                        e.target.value
                      )
                    }
                    className="ur-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedIngredients = [...formik.values.ingredients];
                      updatedIngredients.splice(index, 1);
                      formik.setFieldValue("ingredients", updatedIngredients);
                    }}
                    className="ml-2 text-red-500 focus:outline-none"
                  >
                    &#x2715;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleIngredientAdd}
                className="ur-add"
              >
                Ekle
              </button>
            </label>
          </div>

          <div className="flex justify-end items-end">
            <button type="submit" className="ur-upd">
              Ekle
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddRecipe;
