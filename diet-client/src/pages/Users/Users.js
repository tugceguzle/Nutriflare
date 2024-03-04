import React from "react";
import { deleteList, fetchUserAll } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { deleteSvg, updateSvg, addSvg } from "../Svg.js";
import UserWaterDetails from "./UserWaterDetails";

function Users() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserAll,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  if (isPending) return <Loading />;
  if (error) return "An error has occurred: " + error.message;

  const handleDelete = (userId) => {
    const isConfirmed = window.confirm(
      "Bu kullanıcıyı silmek istediğinizden emin misiniz?"
    );
    if (isConfirmed) {
      deleteMutation.mutate(userId, {
        onSuccess: () => {
          console.log("Başarılı");
        },
      });
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]} ${match[3]}`;
    }
    return phoneNumber;
  };

  const calculateVki = (weight, size) => {
    const vki = (weight / (((size / 100) * size) / 100)).toFixed(2);
    return vki || 0;
  };

  const determineObesityCategory = (weight, size) => {
    const vki = calculateVki(weight, size);
    if (vki < 18.5) {
      return "Zayıf";
    } else if (vki >= 18.5 && vki <= 24.9) {
      return "Normal ağırlıkta";
    } else if (vki >= 25.0 && vki <= 29.9) {
      return "Kilolu";
    } else if (vki >= 30.0 && vki <= 34.9) {
      return "1. derece obezite";
    } else if (vki >= 35.0 && vki <= 39.9) {
      return "2. derece obezite";
    } else {
      return "3. derece obezite";
    }
  };

  return (
    <>
      <div className="u-header">Danışanlar</div>
      <section className="dl-sec">
        <div className="dl-div">
          <div className="dl-div-two">
            <div className="dl-div-three">
              <div className="dl-div-four">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className=" font-bold">
                      <th scope="col" className="users-th"></th>
                      <th scope="col" className="users-th">
                        Ad Soyad
                      </th>
                      <th scope="col" className="users-th">
                        Telefon Numarası
                      </th>
                      <th scope="col" className="users-th">
                        Yaş
                      </th>
                      <th scope="col" className="users-th">
                        Boy (cm)
                      </th>
                      <th scope="col" className="users-th">
                        Kilo (kg)
                      </th>
                      <th scope="col" className="users-th">
                        VKİ (kg/m²)
                      </th>
                      <th scope="col" className="users-th">
                        Cinsiyet
                      </th>
                      <th scope="col" className="users-th">
                        Kaloriler
                      </th>
                      <th scope="col" className="users-th">
                        Profil Detayları
                      </th>
                      <th scope="col" className="users-th">
                        Su Tüketimi
                      </th>
                      <th scope="col" className="users-th">
                        Diyet Listesi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(
                      (user, key) =>
                        user.role !== "admin" && (
                          <>
                            <tr key={key}>
                              <td className="users-td">
                                <div className="u-btn-div">
                                  <img
                                    className="uh-img"
                                    src={user.profilePhoto!=="" ? user.profilePhoto : user.gender==="male" ? "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td className="users-td">
                                <strong>
                                  {user.name} {user.surname}{" "}
                                </strong>
                              </td>
                              <td className="users-td">
                                +90 {formatPhoneNumber(user.phoneNumber)}{" "}
                              </td>
                              <td className="users-td">19</td>
                              <td className="users-td">{user.size_cm}</td>
                              <td className="users-td">{user.weight_kg}</td>
                              <td className="users-td">
                                {calculateVki(user.weight_kg, user.size_cm)}
                                 {" "}~{" "}
                                {determineObesityCategory(
                                  user.weight_kg,
                                  user.size_cm
                                )}{" "}
                              </td>
                              <td className="users-td">
                                {user.gender === "female"
                                  ? "KIZ"
                                  : user.gender === "male"
                                  ? "ERKEK"
                                  : "-"}
                              </td>
                              <td className="users-td">
                                <a
                                  href={`/admin/calories/${user._id}`}
                                  class="u-btn"
                                >
                                  Detay
                                </a>
                              </td>
                              <td className="users-td">
                                <a
                                  href={`/admin/userdetail/${user._id}`}
                                  class="u-btn"
                                >
                                  Detay
                                </a>
                              </td>
                              <td className="users-td">
                                <UserWaterDetails userId={user._id} />
                              </td>
                              <td className="users-td">
                                {!user.dietList && (
                                  <a
                                    href={`/admin/list/add/${user._id}`}
                                    class="inline-flex items-center justify-center space-x-2 u-btn"
                                  >
                                    {addSvg}
                                    <div>Ekle</div>
                                  </a>
                                )}

                                {user.dietList && (
                                  <>
                                    <div className="rd-flex-two">
                                      <div className="rc-svg">
                                        <button
                                          onClick={() => handleDelete(user._id)}
                                        >
                                          {deleteSvg}
                                        </button>
                                        <a
                                          href={`/admin/list/update/${user._id}`}
                                        >
                                          {updateSvg}
                                        </a>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </td>
                            </tr>
                          </>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Users;
