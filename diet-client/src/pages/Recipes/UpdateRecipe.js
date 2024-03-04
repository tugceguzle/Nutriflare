import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateRecipe, fetchRecipe } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert.js";

const UpdateRecipe = () => {
  const [submitMessage, setSubmitMessage] = useState("");
  const { recipe_id } = useParams();
  const {
    isFetching,
    error,
    data: recipe,
  } = useQuery({
    queryKey: ["recipe", recipe_id],
    queryFn: () => fetchRecipe(recipe_id),
  });

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
        await updateRecipe(recipe_id, {
          name: values.name,
          image: values.image,
          description: values.description,
          preparationTime: values.preparationTime,
          ingredients: values.ingredients,
        });
        setSubmitMessage("Tarif başarı ile güncellendi!");
      } catch (error) {
        const errorHtml = error.response.data;
        const errorMatch = errorHtml.match(/<pre>(.*?)<br>/);
        if (errorMatch && errorMatch[1]) {
          const errorMessage = errorMatch[1].trim();
          console.log(errorMessage);
          bag.setErrors({ general: errorMessage });
        }
        setSubmitMessage("Tarif Güncellenemedi!");
      }
    },
  });
  useEffect(() => {
    if (!isFetching && recipe) {
      formik.setValues({
        name: recipe.name,
        image: recipe.image,
        description: recipe.description,
        preparationTime: recipe.preparationTime,
        ingredients: recipe.ingredients,
      });
    }
  }, [isFetching, recipe, formik.setValues]);

  const handleIngredientAdd = () => {
    if (formik.values.ingredients.length < 10) {
      formik.setFieldValue("ingredients", [...formik.values.ingredients, ""]);
    }
  };

  if (isFetching) return <Loading />;

  if (error) return "An error has occurred: " + error.message;

  return (
    <section className="al-sec">
      {submitMessage && (
        <Alert description={submitMessage}/>
      )}
      <h2 className="p-h">
        Tarif Güncelle
      </h2>
      <div className="rd-flex-two">
        <div className="rd-img-div m-0">
          <img
            alt="content"
            className="rc-img"
            src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
      </div>

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
              Tarif Görseli:
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
              Hazırlanma Süresi:
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
                    &#x2715; {/* Multiplication symbol (X) */}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleIngredientAdd}
                className="ur-add"
              >
                Malzeme Ekle
              </button>
            </label>
          </div>
          <div className="flex justify-end items-end">
            <button type="submit" className="ur-upd">
              Güncelle
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UpdateRecipe;
