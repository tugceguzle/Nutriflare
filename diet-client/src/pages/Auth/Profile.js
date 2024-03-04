import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import { fetchUser, updateUser } from "../../api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Alert from "../../components/Alert.js";

function Profile() {
  const { user } = useAuth();
  const { user_id } = useParams();
  const role = user.role;
  let userid;

  if (role === "admin" && user_id) {
    userid = user_id;
  } else {
    userid = user._id;
  }

  const [submitMessage, setSubmitMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const {
    isFetching,
    error,
    data: userprofile,
  } = useQuery({
    queryKey: ["userprofile", userid],
    queryFn: () => fetchUser(userid),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      phoneNumber: "",
      profilePhoto: "",
      birthdayDate: "",
      weight_kg: 0,
      size_cm: 0,
      gender: "none",
    },
    onSubmit: async (values, bag) => {
      try {
        await updateUser(userid, {
          name: values.name,
          surname: values.surname,
          email: values.email,
          profilePhoto: values.profilePhoto,
          phoneNumber: values.phoneNumber,
          birthdayDate: values.birthdayDate,
          weight_kg: values.weight_kg,
          size_cm: values.size_cm,
          gender: values.gender,
        });
        setSubmitMessage("Kullanıcı bilgileri başarı ile güncellendi!");
        console.log(values)
        setIsEditing(false);
      } catch (error) {
        const errorHtml = error.response.data;
        const errorMatch = errorHtml.match(/<pre>(.*?)<br>/);
        if (errorMatch && errorMatch[1]) {
          const errorMessage = errorMatch[1].trim();
          console.log(errorMessage);
          bag.setErrors({ general: errorMessage });
        }
        setSubmitMessage("Kullanıcı bilgileri güncellenemedi!");
      }
    },
  });

  useEffect(() => {
    if (!isFetching && userprofile) {
      formik.setValues({
        name: userprofile.name,
        surname: userprofile.surname,
        email: userprofile.email,
        profilePhoto: userprofile.profilePhoto,
        phoneNumber: userprofile.phoneNumber,
        birthdayDate: userprofile.birthdayDate,
        gender: userprofile.gender,
        weight_kg: userprofile.weight_kg,
        size_cm: userprofile.size_cm,
      });
    }
  }, [isFetching, user, formik.setValues]);

  if (isFetching) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <section class="p-sec mt-12">
        {submitMessage && <Alert description={submitMessage} />}
        <h2 class="p-h">Profil Ayarları</h2>
        <form onSubmit={formik.handleSubmit}>
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <div className="float-start w-1/3">
                <img
                  className="p-img"
                  src={formik.values.profilePhoto}
                  alt="user profile photo"
                />
              </div>
              <div className="float-end w-2/3">
                <label class="text-gray-700" for="profilePhoto">
                  Profil Fotoğrafını Güncelleyiniz.
                </label>
                <input
                  id="profilePhoto"
                  type="text"
                  class="p-input"
                  disabled={!isEditing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.profilePhoto}
                />
              </div>
            </div>
            <div></div>
            <div>
              <label class="text-gray-700" for="name">
                Ad
              </label>
              <input
                id="name"
                type="text"
                class="p-input"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            <div>
              <label class="text-gray-700" for="surname">
                Soyad
              </label>
              <input
                id="surname"
                type="text"
                class="p-input"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.surname}
              />
            </div>
            <div>
              <label class="text-gray-700" for="email">
                E-posta
              </label>
              <input
                id="email"
                type="text"
                class="p-input"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            <div>
              <label class="text-gray-700" for="phoneNumber">
                Telefon Numarası
              </label>
              <input
                id="phoneNumber"
                type="text"
                class="p-input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label class="text-gray-700" for="birthdayDate">
                Doğum Tarihi
              </label>

              {isEditing ? (
                <input
                  id="birthdayDate"
                  type="date"
                  class="p-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.birthdayDate}
                  disabled={!isEditing}
                />
              ) : (
                <input
                  id="birthdayDate"
                  type="text"
                  class="p-input"
                  value={formik.values.birthdayDate.split("T")[0]}
                  disabled={!isEditing}
                />
              )}
            </div>
            <div className="flex align-bottom">
              <label htmlFor="female" className="text-base text-gray-700 me-2">
                Kız
              </label>
              <input
                type="radio"
                id="female"
                name="gender"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value="female"
                checked={formik.values.gender === "female"}
                className="form-radio lock my-4 p-radio"
              />

              <label
                htmlFor="male"
                className="text-base text-gray-700  ms-12 me-2"
              >
                Erkek
              </label>
              <input
                type="radio"
                id="male"
                name="gender"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value="male"
                checked={formik.values.gender === "male"}
                className="form-radio lock my-4 p-radio"
              />
            </div>
            <div>
              <label class="text-gray-700" for="weight_kg">
                Kilo (kg)
              </label>
              <input
                id="weight_kg"
                type="number"
                disabled={!isEditing}
                class="p-input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.weight_kg}
              />
            </div>
            <div>
              <label class="text-gray-700" for="size_cm">
                Boy (cm)
              </label>
              <input
                id="size_cm"
                type="number"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.size_cm}
                class="p-input"
              />
            </div>
          </div>
          <div class="flex justify-end mt-6">
            {isEditing ? (
              <button type="submit" className="p-a">
                Kaydet
              </button>
            ) : (
              <a className="p-a" onClick={handleEditClick}>
                Düzenle
              </a>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

export default Profile;
