import React, { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown.js";
import { fetchCalories, fetchDietList } from "../../api.js";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext.js";
import { calculateCalories } from "../Graph/caloriesData.js";
import Calories from "../Graph/Calories.js";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading.js";
import { ok } from "../Svg.js";

function UserCalories() {
  const { user } = useAuth();
  const role = user.role;
  const user_id = useParams();
  let userid;
  if (role === "admin") {
    userid = user_id.user_id;
  } else {
    userid = user._id;
  }
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
  const [formattedCaloriesList, setFormattedCaloriesList] = useState([]);

  const {
    caloriesIsPending,
    caloriesError,
    data: calorieslist,
  } = useQuery({
    queryKey: ["calories", userid],
    queryFn: () => fetchCalories(userid),
  });
  useEffect(() => {
    const formattedList =
      calorieslist &&
      calorieslist.map((calorie) => {
        const dateParts = calorie.createdAt.split("T");
        const isoDate = dateParts[0];
        return {
          ...calorie,
          formattedCreatedAt: isoDate,
        };
      });

    setFormattedCaloriesList(formattedList);
  }, [calorieslist]);
  const {
    dietlistIsPending,
    dietlistError,
    data: dietlist,
  } = useQuery({
    queryKey: ["dietlist", userid],
    queryFn: () => fetchDietList(userid),
  });
  if (
    !calorieslist ||
    !dietlist ||
    calorieslist.length === 0 ||
    dietlist.length === 0 ||
    !dietlist.days
  ) {
    return "No data available.";
  }
  if (caloriesIsPending || dietlistIsPending) return <Loading />;
  if (caloriesError || dietlistError) {
    const errorMessage = caloriesError
      ? caloriesError.message
      : dietlistError.message;
    return "An error has occurred: " + errorMessage;
  }

  const { consumedCalories, burnedCalories } = calculateCalories(calorieslist);
  const dailyTotals = calorieslist.reduce((totals, calorie) => {
    const date = calorie.createdAt.split("T")[0];

    if (!totals[date]) {
      totals[date] = { consumed: 0, burned: 0 };
    }

    if (calorie.caloriesConsumed) {
      totals[date].consumed += parseInt(calorie.calorie_cal, 10);
    }

    if (calorie.caloriesBurned) {
      totals[date].burned += parseInt(calorie.calorie_cal, 10);
    }

    return totals;
  }, {});

  const dayList = dietlist.days[currentDay];
  const totalcal = dayList.dailyTotalCalories;

  return (
    <>
      {user.role === "user" && (
        <>
          <div className="dl-header">Günlük Kalori İstatistiği</div>
          <div className="mx-20 m-auto overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="py-8 flex flex-wrap md:flex-nowrap">
              <div className="cal-g-div">
                <Calories totalcal={totalcal}></Calories>
              </div>
              <div className="md:flex-grow ms-10 me-6">
                <h2 className="cal-h">Kalori Oranları</h2>
                <div className="leading-relaxed">
                  <div className="leading-relaxed flex flex-wrap">
                    <div className="my-2 w-60 flex-shrink-0">
                      <span className="text-thorange cal-desc bg-orange-100/60">
                        Günlük Kalori Miktarı = {totalcal}cal
                      </span>
                    </div>
                    <div className="my-2 w-60 flex-shrink-0">
                      <span className="text-pink-600 cal-desc bg-pink-100/60">
                        Yakılan Ek Kalori Miktarı = {burnedCalories}cal
                      </span>
                    </div>
                    <div className="my-2 w-60 flex-shrink-0">
                      <span className="text-blue-600 cal-desc bg-blue-100/60">
                        Alınan Ek Kalori Miktarı = {consumedCalories}cal
                      </span>
                    </div>
                    <div className="my-2 w-60 flex-shrink-0">
                      <span className="text-cyan-600 cal-desc bg-cyan-100/60">
                        Net Kalori Miktarı ={" "}
                        {totalcal - burnedCalories + consumedCalories}cal
                      </span>
                    </div>
                  </div>
                  Kalori, besinlerin ve içeceklerin vücudumuza sağladığı enerji
                  birimidir. Yiyeceklerde bulunan karbonhidratlar, proteinler,
                  yağlar ve diğer besin öğeleri, belirli miktarda kalori içerir.
                  Bu kaloriler, vücudun günlük enerji ihtiyacını karşılamak,
                  metabolik işlevleri sürdürmek, vücut sıcaklığını düzenlemek ve
                  hücre büyümesini desteklemek gibi çeşitli görevlerde
                  kullanılır. Her bireyin enerji ihtiyacı yaş, cinsiyet, kilo,
                  aktivite düzeyi ve genetik faktörlere bağlı olarak değişir.
                </div>
                <a href="/" className="rc-link">
                  Daha fazla bilgi için tıklayınız...
                  {ok}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="dl-header">Kalori Tablosu</div>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="cal-th">
                        Tarih
                      </th>
                      <th scope="col" className="cal-th">
                        Günlük Kalori Miktarı
                      </th>
                      <th scope="col" className="cal-th">
                        Yakılan Ek Kalori Miktarı
                      </th>
                      <th scope="col" className="cal-th">
                        Alınan Ek Kalori Miktarı
                      </th>
                      <th scope="col" className="cal-th">
                        Toplam Kalori
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(dailyTotals).map(([date, totals]) => {
                      const dayNames = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ];
                      const isoDate = dayNames[new Date(date).getDay()];
                      const dailyTotalCalories =
                        dietlist.days[isoDate]?.dailyTotalCalories || 0;
                      return (
                        <tr key={date}>
                          <td className="cal-td">
                            <p className="cal-date">{date}</p>
                          </td>
                          <td className="cal-td text-center">
                            <div className="cal-td-div">
                              <div className="w-full text-center">
                                {dailyTotalCalories} cal
                              </div>
                            </div>
                          </td>
                          <td className="cal-td text-center">
                            {totals.burned !== 0 && (
                              <Dropdown
                                dropdownId={1}
                                date={date}
                                formattedCaloriesList={formattedCaloriesList}
                                burned={true}
                                caldata={totals.burned}
                              ></Dropdown>
                            )}
                          </td>
                          <td className="cal-td text-center">
                            {totals.consumed === 0 && (
                              <div className=" cal-td-div">
                                <div className="w-full text-center">0 Cal</div>
                              </div>
                            )}
                            {totals.consumed !== 0 && (
                              <Dropdown
                                dropdownId={2}
                                date={date}
                                formattedCaloriesList={formattedCaloriesList}
                                burned={false}
                                caldata={totals.consumed}
                              />
                            )}
                          </td>
                          <td className="cal-td text-center">
                            <div className="cal-td-div">
                              <div className="w-full text-center">
                                {" "}
                                {dailyTotalCalories -
                                  totals.burned +
                                  totals.consumed}{" "}
                                cal
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default UserCalories;
