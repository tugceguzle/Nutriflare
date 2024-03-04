import React, { useEffect, useState } from "react";
import Quote from "../../components/Quote";
import { stars, ok } from "../Svg.js";
import Calories from "../Graph/Calories.js";
import { useAuth } from "../../context/AuthContext.js";
import {
  addWater,
  addCalorie,
  fetchDietList,
  fetchRecipesAll,
  fetchWater,
} from "../../api";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading.js";
import Alert from "../../components/Alert.js";

function UserHome() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const [isOpenTwo, setIsOpenTwo] = useState(false);
  const openModalTwo = () => {
    setIsOpenTwo(true);
  };
  const closeModalTwo = () => {
    setIsOpenTwo(false);
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[dayOfWeek];
  const { user } = useAuth();
  const [submitMessage, setSubmitMessage] = useState("");
  const [targetDayTotalCalories, setTargetDayTotalCalories] = useState(null);
  const [calorieAdded, setCalorieAdded] = useState(false);
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
      caloriesConsumed: false,
      caloriesBurned: false,
      description: "",
      calorie_cal: "",
      user_id: `${user._id}`,
    },
    onSubmit: async (values, bag) => {
      try {
        await addCalorie({
          caloriesConsumed: values.caloriesConsumed === "on" ? true : false,
          caloriesBurned: values.caloriesBurned === "on" ? true : false,
          description: values.description,
          calorie_cal: values.calorie_cal,
          user_id: `${user._id}`,
        });
        setSubmitMessage("Kalori başarı ile eklendi!");
        setCalorieAdded(true);
        formik.resetForm();
      } catch (error) {
        const errorHtml = error.response.data;
        const errorMatch = errorHtml.match(/<pre>(.*?)<br>/);
        if (errorMatch && errorMatch[1]) {
          const errorMessage = errorMatch[1].trim();
          bag.setErrors({ general: errorMessage });
        }
        setSubmitMessage("Kalori Eklenemedi!");
      }
    },
  });
  const formik_wt = useFormik({
    initialValues: {
      user_id: "",
      water_ml: "",
    },
    onSubmit: async (values, bag) => {
      try {
        await addWater({
          user_id: `${user._id}`,
          water_ml: values.water_ml,
        });
        setSubmitMessage("Su bilgisi başarı ile eklendi!");
        formik_wt.resetForm();
        await refetchWaters();
      } catch (error) {
        const errorHtml = error.response.data;
        const errorMatch = errorHtml.match(/<pre>(.*?)<br>/);
        if (errorMatch && errorMatch[1]) {
          const errorMessage = errorMatch[1].trim();
          bag.setErrors({ general: errorMessage });
        }
        setSubmitMessage("Su bilgisi eklenemedi!");
      }
    },
  });

  useEffect(() => {
    if (formik.values.caloriesBurned) {
      formik.setFieldValue("caloriesConsumed", false);
    }
    if (formik.values.caloriesConsumed) {
      formik.setFieldValue("caloriesBurned", false);
    }
  }, [formik.values.caloriesBurned, formik.values.caloriesConsumed]);

  const {
    dietlistIsPending,
    dietlistError,
    data: dietlist,
  } = useQuery({
    queryKey: ["dietlist", user._id],
    queryFn: () => fetchDietList(user._id),
  });
  const {
    recipesIsPending,
    recipesError,
    data: recipes,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipesAll,
  });
  const {
    waterIsPending,
    waterError,
    data: waters,
    refetch: refetchWaters,
  } = useQuery({
    queryKey: ["waters", user._id],
    queryFn: () => fetchWater(user._id),
  });

  useEffect(() => {
    if (dietlist && dietlist.days && dietlist.days[currentDay]) {
      const calories = dietlist.days[currentDay].dailyTotalCalories;
      setTargetDayTotalCalories(calories);
    } else {
      console.log(
        `Gün bulunamadı veya günün dailyTotalCalories değeri mevcut değil.`
      );
    }
  }, [currentDay, dietlist]);

  if (dietlistIsPending || recipesIsPending || waterIsPending)
    return <Loading />;

  if (dietlistError || recipesError || waterError) {
    const errorMessage = dietlistError
      ? dietlistError.message
      : recipesError.message
      ? recipesError.message
      : waterError.message;
    return "An error has occurred: " + errorMessage;
  }

  const vki = (
    user.weight_kg /
    (((user.size_cm / 100) * user.size_cm) / 100)
  ).toFixed(2);
  function determineObesityCategory(vki) {
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
  }
  const result = determineObesityCategory(vki);
  const lastThreeRecipes = recipes ? recipes.slice(-3) : [];

  const averageWater = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayWaters =
      waters &&
      waters.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.toISOString().split("T")[0] ===
          today.toISOString().split("T")[0]
        );
      });
    if (!todayWaters || todayWaters.length === 0) {
      console.log("todayWaters dizisi tanımsız veya bir dizi değil.");
      return 0;
    }
    let totalWater = 0;
    for (const item of todayWaters) {
      totalWater += item.water_ml;
    }
    return Math.floor((totalWater * 100) / 2450);
  };

  const daywater = averageWater() ? averageWater() : 0;
  return (
    <div>
      {submitMessage && <Alert description={submitMessage} />}
      <section className="text-gray-600  mt-4 lg:mt-20">
        <div className="ad-cont">
          <div className="ad-flex">
            <div className="uh-div w-full">
              <div className="uh-div-two">
                <h2 className="uh-h-o mb-6">KULLANICI BİLGİLERİ</h2>
                <div className="uh-flex">
                  <div className="uh-img-div">
                    <img
                      src={user.profilePhoto}
                      className="uh-img"
                      alt="avatar"
                    />
                  </div>
                </div>

                <h2 className="uh-h mt-6">
                  {user.name} {user.surname}
                </h2>
                <p className="uh-p mb-1">Kilo (kg) : {user.weight_kg}</p>
                <p className="uh-p mb-1">Boy (cm) : {user.size_cm}</p>
                <p className="uh-p">
                  VKİ (kg/m²) : {vki} ~ {result}
                </p>
              </div>
            </div>
            <div className="uh-div w-full">
              <div className="uh-div-two">
                <h2 className="uh-h-o mb-4">GÜNLÜK SU MİKTARI</h2>
                <h2 className="uh-h">Günlük 2100mL - 2450mL su içmelisiniz.</h2>
                <div className="uh-bar-div">
                  <div className="uh-bar" style={{ width: ` ${daywater}%` }}>
                    {" "}
                    {daywater}%
                  </div>
                </div>
                <p className="leading-relaxed mb-3">
                  Su içmek, vücut için elzemdir. Hücreleri nemli tutar,
                  metabolizmayı destekler ve enerji seviyelerini yükseltir.
                  Günde yeterli su içmek, genel sağlığı artırmanın basit ve
                  etkili bir yoludur. Sağlıklı yaşam için su içmeyi alışkanlık
                  haline getirmek, vücudu ve zihni güçlendirmenin temel bir
                  adımıdır.
                </p>
                <button onClick={openModal} className="text-thorange">
                  Su bilgisi ekle
                </button>
                <br></br>
                <button onClick={openModalTwo} className="text-thorange">
                  Su geçmişi için tıklayınız...
                </button>
                <br></br>
              </div>
            </div>
            <div className="uh-div w-full">
              <div className="uh-div-two">
                <h2 className="uh-h-o mb-4">EK KALORİLER</h2>
                <div className="uh-form-div">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="relative mb-4">
                      <label htmlFor="calorie_cal" className="uh-lbl">
                        Kalori Miktarı (cal)
                      </label>
                      <input
                        type="text"
                        name="calorie_cal"
                        className="uh-input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.calorie_cal}
                      />
                    </div>
                    <div className="relative mb-4">
                      <label htmlFor="description" className="uh-lbl">
                        Açıklama
                      </label>
                      <textarea
                        name="description"
                        className="uh-input  resize-none leading-6 h-24"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                      ></textarea>
                    </div>
                    <div className="relative mb-4">
                      <input
                        type="radio"
                        id="caloriesBurned"
                        name="caloriesBurned"
                        className="form-radio"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.caloriesBurned}
                      />
                      <label htmlFor="caloriesBurned" className="text-sm me-5">
                        Yakılan
                      </label>
                      <input
                        type="radio"
                        id="caloriesConsumed"
                        name="caloriesConsumed"
                        className="form-radio"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.caloriesConsumed}
                      />
                      <label htmlFor="caloriesConsumed" className="text-sm">
                        Alınan
                      </label>
                    </div>
                    <button className="uh-btn" type="submit">
                      Ekle
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Quote
        text={`"Başarının sırrı, düşüncelerinizi eylemlere dönüştürmekte yatar."`}
        author={"Tony Robbins"}
      ></Quote>
      <div className="uh-div-cont">
        <div className="uh-div-flex">
          <div className="ad-graph">
            <Calories
              totalcal={
                targetDayTotalCalories === "" ? 0 : targetDayTotalCalories
              }
              refresh={calorieAdded ? calorieAdded : false}
            ></Calories>
          </div>
          <div className="md:flex-grow ms-10 me-6">
            <h2 className="ad-h-two">Kalori Oranları</h2>
            <p className="leading-relaxed">
              Kalori, besinlerin ve içeceklerin vücudumuza sağladığı enerji
              birimidir. Yiyeceklerde bulunan karbonhidratlar, proteinler,
              yağlar ve diğer besin öğeleri, belirli miktarda kalori içerir. Bu
              kaloriler, vücudun günlük enerji ihtiyacını karşılamak, metabolik
              işlevleri sürdürmek, vücut sıcaklığını düzenlemek ve hücre
              büyümesini desteklemek gibi çeşitli görevlerde kullanılır. Her
              bireyin enerji ihtiyacı yaş, cinsiyet, kilo, aktivite düzeyi ve
              genetik faktörlere bağlı olarak değişir. Sağlıklı bir yaşam
              sürdürebilmek ve gereksiz kilo alımını önlemek için önemli olan
              şey, kalori alımını dengelemektir. Bunun için sağlıklı beslenme
              alışkanlıkları geliştirmek, porsiyon kontrolü yapmak ve düzenli
              fiziksel aktiviteyi hayatınıza entegre etmek önemlidir. Bu sayede,
              vücudunuzun ihtiyaç duyduğu enerjiyi alabilir ve genel sağlığınızı
              destekleyebilirsiniz. Beslenme alışkanlıklarınızı kişiselleştirmek
              ve uzman bir sağlık profesyoneli ile danışmak, kalori yönetimi
              konusunda daha etkili bir yaklaşım benimsemenize yardımcı
              olabilir.
            </p>
            <a href="/" className="rc-link">
              Daha fazla bilgi için tıklayınız...
              {ok}
            </a>
          </div>
        </div>
      </div>
      <Quote
        text={`"Yüksek hedeflere sadece yüksek çaba ile ulaşılır."`}
        author={"Jack Ma"}
      ></Quote>
      <section className="text-gray-600 my-8">
        <div className="ad-cont">
          <div className="uh-recipe">
            {lastThreeRecipes.map((item, key) => (
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
                  <a href={`/recipes/${item._id}`} className="rc-link">
                    Tarif Detayı İçin Tıklayınız...
                    {ok}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {isOpen && (
        <div>
          <div
            className="modal-bg"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={closeModal}
          ></div>

          <div
            className="modal-cont"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-div">
              <span className="modal-span" aria-hidden="true">
                &#8203;
              </span>

              <div className="modal-div-two">
                <h3 className="modal-h-three" id="modal-title">
                  Su Bilgisi Ekle
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Bugün ne kadar su içtiğinizi giriniz. (mL cinsinden)
                </p>
                <form onSubmit={formik_wt.handleSubmit}>
                  <div>
                    <input
                      id="water"
                      type="number"
                      name="water_ml"
                      onChange={formik_wt.handleChange}
                      onBlur={formik_wt.handleBlur}
                      value={formik_wt.values.water_ml}
                      class="modal-input"
                    />
                  </div>

                  <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                    <button onClick={closeModal} className="modal-close">
                      Kapat
                    </button>

                    <button type="submit" className="modal-add">
                      Ekle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpenTwo && (
        <div>
          <div
            className="modal-bg"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={closeModalTwo}
          ></div>

          <div
            className="modal-cont"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-div">
              <span className="modal-span" aria-hidden="true">
                &#8203;
              </span>

              <div className="modal-div-two">
                <h3 className="modal-h-three" id="modal-title">
                  <span
                    onClick={closeModalTwo}
                    className="float-end text-gray-600"
                  >
                    x
                  </span>
                </h3>

                <table className="min-w-full divide-y divide-gray-200 my-3">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="users-th">
                        Tarih
                      </th>
                      <th scope="col" className="users-th">
                        Su Miktarı (mL)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waters.map((i, key) => (
                      <tr key={key}>
                        <td className="users-td">
                          {i.createdAt.split("T")[0]}
                        </td>
                        <td className="users-td">{i.water_ml}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="modal-btn-div">
                  <button onClick={closeModalTwo} className="modal-close">
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHome;
