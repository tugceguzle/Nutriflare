import React, { useState, useEffect } from "react";
import Theme from "../../components/Theme";
import loginImg from "../../img/forgot.png";
import { useFormik } from "formik";
import { validationsLogin } from "./validations.js";
import { fetchLogin } from "../../api.js";
import { useAuth } from "../../context/AuthContext.js";
import Alert from "../../components/Alert.js";

function Login() {
  const {login} = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || null);
  useEffect(() => {
    if (theme) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [theme]);
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationsLogin,
    onSubmit: async (values, bag) => {
      try {
        const loginResponse = await fetchLogin({
          email: values.email,
          password: values.password,
        });
        login(loginResponse);
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
            alt="giriş yapma ekranı görseli"
            src={loginImg}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="absolute top-3 right-3">
              <Theme theme={theme} handleThemeSwitch={() => handleThemeSwitch()}/>
            </div>
            <div className="text-center">
              <h2 className="text-2xl dark:text-white">GİRİŞ YAP</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">
              Hesabınıza erişmek için oturum açın
              </p>
            </div>
            {formik.errors.general && (
              <Alert description={formik.errors.general} />
            )}
            {formik.touched.email && formik.errors.email && (
              <Alert description={formik.errors.email} />
            )}
            {formik.touched.password && formik.errors.password && (
              <Alert description={formik.errors.password} />
            )}
            <div className="mt-8">
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 label-login">
                    E-posta Adresi
                  </label>
                  <input
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder="example@example.com"
                    className="login-input"
                  />
                </div>
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="label-login">
                      Şifre
                    </label>
                    <a
                      href="/"
                      className="text-sm text-gray-400 focus:text-cyan-500 hover:text-cyan-500 hover:underline"
                    >
                      Şifreni mi unuttun?
                    </a>
                  </div>
                  <input
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder="Şifreniz"
                    className="login-input"
                  />
                </div>
                <div className="mt-6">
                  <button className="btn-login" type="submit">
                    Giriş Yap
                  </button>
                </div>
              </form>
              <p className="mt-6 text-sm text-center text-gray-400">
              Henüz bir hesabınız yok mu?{" "}
                <a
                  href="/register"
                  className="text-thorange focus:outline-none focus:underline hover:underline"
                >
                  Kaydol
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
