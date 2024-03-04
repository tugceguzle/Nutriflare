import React from "react";
import { fetchRecipe } from "../../api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading.js";

function RecipeDetail() {
  const { recipe_id } = useParams();
  const {
    isPending,
    error,
    data: recipe,
  } = useQuery({
    queryKey: ["recipe", recipe_id],
    queryFn: () => fetchRecipe(recipe_id),
  });

  if (isPending) return <Loading />;

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div className="rd-cont">
        <div className="rd-flex">
          <div className="w-full md:w-2/3 lg:w-2/3">
            <div className="rd-flex-two">
              <div className="rd-img-div">
                <img
                  alt="content"
                  className="rc-img"
                  src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </div>
            </div>
            <div className="rd-h-div">
              <h1 className="text-xl font-bold">{recipe.name}</h1>
            </div>
            <div className="rd-div">
              <p className="text-gray-600 mb-4">
                <strong>Oluşturulma Tarihi:</strong>{" "}
                {recipe.createdAt.split("T")[0]}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Hazırlanma Süresi:</strong> {recipe.preparationTime}{" "}
                dakika
              </p>
              <div className="text-gray-600 mb-4">
                <strong>Malzemeler:</strong>
                <ul className="list-disc pl-6">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="text-gray-600 mb-4">
                <strong>Tarifin Yapılışı:</strong>
              <p className="text-gray-600 mb-4">
  {recipe.description.split('\n').map((item, index) => (
    <p key={index}>{item}</p>
  ))}
</p>
</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeDetail;
