import React, { useState, useEffect } from "react";
import Theme from "../../components/Theme";
import register from "../../img/forgot.png";
import { validationsRegister } from "./validations";
import { useFormik } from "formik";
import { fetchRegister } from "../../api";
import { useNavigate } from "react-router-dom";
import { registersvg } from "../Svg";
import Alert from "../../components/Alert.js"

function Register() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || null);
  useEffect(() => {
    if (theme) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [theme]);

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      phoneNumber: "",
      email: "",
      password: "",
      birthdayDate: "",
    },
    validationSchema: validationsRegister,
    onSubmit: async (values, bag) => {
      try {
        await fetchRegister({
          name: values.name,
          surname: values.surname,
          phoneNumber: values.phoneNumber,
          email: values.email,
          password: values.password,
          birthdayDate: values.birthdayDate,
        });
        navigate("/login");
      } catch (error) {
        const errorHtml = error.response.data;
        const errorMatch = errorHtml.match(/<pre>(.*?)<br>/);
        if (errorMatch && errorMatch[1]) {
          const errorMessage = errorMatch[1].trim();
          bag.setErrors({ general: errorMessage });
        }
      }
    },
  });
  const handleThemeSwitch = () => {
    if (theme) {
      setTheme(false);
      localStorage.removeItem("theme");
    } else {
      setTheme(true);
      localStorage.setItem("theme", true);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex justify-center min-h-screen">
        <div className="hidden lg:block lg:w-2/5 m-5">
          <img
            src={register}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="register-div">
          <div className="w-full">
            <h1 className="register-h">
            Hesabınızı hemen oluşturun.
              <div className="flex-grow"></div>
              <div className="absolute top-3 right-3">
                <Theme
                  theme={theme}
                  handleThemeSwitch={() => handleThemeSwitch()}
                />
              </div>
            </h1>
            <p className="register-p">
            Kişisel hesabınızı doğrulayabilmeniz ve profilinizi oluşturmaya başlayabilmeniz için tüm ayarları yapalım.
            </p>
            {formik.errors.general && (
              <Alert description={formik.errors.general} />
            )}
             {formik.touched.name && formik.errors.name && (
              <Alert description={formik.errors.name} />
            )}
            {formik.touched.surname && formik.errors.surname && (
              <Alert description={formik.errors.surname} />
            )}
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <Alert description={formik.errors.phoneNumber} />
            )}
             
            {formik.touched.email && formik.errors.email && (
              <Alert description={formik.errors.email} />
            )}
            {formik.touched.password && formik.errors.password && (
              <Alert description={formik.errors.password} />
            )}
             {formik.touched.birthdayDate && formik.errors.birthdayDate && (
              <Alert description={formik.errors.birthdayDate} />
            )}
            <form
              className="register-form"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label className="register-label">Ad</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ad"
                  className="register-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
              </div>
              <div>
                <label className="register-label">Soyad</label>
                <input
                  type="text"
                  name="surname"
                  placeholder="Soyad"
                  className="register-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.surname}
                />
              </div>
              <div>
                <label className="register-label">Telefon Numarası</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="XXX-XXX-XXXX"
                  className="register-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                />
              </div>
              <div>
                <label className="register-label">E-Posta</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                  className="register-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              <div>
                <label className="register-label">Şifre</label>
                <input
                  type="password"
                  name="password"
                  placeholder="*****"
                  className="register-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
              </div>
              <div>
                <label className="register-label">Doğum Tarihi</label>
                <input
                  type="date"
                  name="birthdayDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.birthdayDate}
                  placeholder="Enter your password"
                  className="register-date"
                />
              </div>
              <button className="register-buton" type="submit">
                <span>Kaydol </span>
                {registersvg}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
