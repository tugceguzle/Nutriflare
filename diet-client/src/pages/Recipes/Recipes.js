import React from "react";
import { ok, stars, deleteSvg, updateSvg } from "../Svg.js";
import { fetchRecipesAll, deleteRecipe } from "../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";

function Recipes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    data: recipes,
    refetch,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipesAll,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
  const handleDelete = (itemId) => {
    const isConfirmed = window.confirm(
      "Bu tarifi silmek istediğinizden emin misiniz?"
    );
    if (isConfirmed) {
      deleteMutation.mutate(itemId, {
        onSuccess: () => {
          console.log("Başarılı");
        },
      });
    }
  };

  if (isPending) return <Loading />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div className="rc-div-cont">
        <div className="rc-h-div">
          <h1 className="rc-h-two">Tarifler</h1>

          {user && user.role === "admin" && (
            <>
              <div className="rc-a-div">
                <a href="/admin/recipe/add" className="rc-a-span">
                  <span>Yeni Tarif Ekle</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <section className="text-gray-600 my-10">
        <div className="ad-cont">
          <div className="uh-recipe">
            {recipes.map((item, key) => (
              <div className="uh-div" key={key}>
                <div className="uh-div-two">
                  <div className="rounded-lg h-64 overflow-hidden">
                    <img
                      alt="content"
                      className="rc-img"
                      src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                  </div>
                  <h2 className="rc-h">{item.name}</h2>
                  <div className="rc-star">
                    {stars} {stars} {stars} {stars} {stars}
                    <span className="rc-span">
                      {item.createdAt.split("T")[0]}
                    </span>
                  </div>
                  <p className="rc-p">
                    {item.description.length > 40
                      ? `${item.description.substring(0, 40)}...`
                      : item.description}
                  </p>
                  <a
                    href={
                      user.role === "admin"
                        ? `/admin/recipes/${item._id}`
                        : `/recipes/${item._id}`
                    }
                    className="rc-link"
                  >
                    Tarif Detayı İçin Tıklayınız...
                    {ok}
                  </a>
                  {user && user.role === "admin" && (
                    <>
                      <div className="rc-svg">
                        <button onClick={() => handleDelete(item._id)}>
                          {deleteSvg}
                        </button>
                        <a href={`/admin/recipes/update/${item._id}`}>
                          {updateSvg}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Recipes;
