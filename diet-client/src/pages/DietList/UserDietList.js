import React from "react";
import Quote from "../../components/Quote";
import Hr from "../../components/Hr";
import { fetchDietList } from "../../api.js";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext.js";
import Calories from "../Graph/Calories.js";
import Loading from "../../components/Loading.js";

function UserDietList() {
  const { user } = useAuth();
  const {
    isPending,
    error,
    data: datalist,
  } = useQuery({
    queryKey: ["dietlist", user._id],
    queryFn: () => fetchDietList(user._id),
  });
  if (isPending) return <Loading/>;
  if (error) return "An error has occurred: " + error.message;
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
  const gunler = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];
  const daysWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const currentDay = daysOfWeek[dayOfWeek];
  const dayList = datalist.days[currentDay];

  return (
    <>
      <div className="dl-header">Günlük Diyet Listesi</div>
      <section className="dl-sec">
        <div className="dl-div">
          <div className="dl-div-two">
            <div className="dl-div-three">
              <div className="dl-div-four">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="dl-th">
                        Kahvaltı
                      </th>
                      <th scope="col" className="dl-th">
                        Ara Öğün
                      </th>
                      <th scope="col" className="dl-th">
                        Öğle Yemeği
                      </th>
                      <th scope="col" className="dl-th">
                        Ara Öğün
                      </th>
                      <th scope="col" className="dl-th">
                        Akşam Yemeği
                      </th>
                      <th scope="col" className="dl-th">
                        Oran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="dl-td">
                        <div className="dl-p">
                          <ul className="p-2 ms-3">
                            {dayList.morningMeal.foods.map((i, key) => (
                              <li className="dl-li" key={key}>
                                {i}
                              </li>
                            ))}
                            <li className="dl-li">
                                {dayList.morningMeal.totalCalories} cal
                              </li>
                          </ul>
                        </div>
                      </td>
                      <td className="dl-td">
                        <div className="dl-p">
                          <ul className="p-2 ms-3">
                            {dayList.snack.foods.map((i, key) => (
                              <li className="dl-li" key={key}>
                                {i}
                              </li>
                            ))}
                             <li className="dl-li">
                                {dayList.snack.totalCalories} cal
                              </li>
                          </ul>
                        </div>
                      </td>
                      <td className="dl-td">
                        <div className="dl-p">
                          <ul className="p-2 ms-3">
                            {dayList.lunch.foods.map((i, key) => (
                              <li className="dl-li" key={key}>
                                {i}
                              </li>
                            ))}
                             <li className="dl-li">
                                {dayList.lunch.totalCalories} cal
                              </li>
                          </ul>
                        </div>
                      </td>
                      <td className="dl-td">
                        <div className="dl-p">
                          <ul className="p-2 ms-3">
                            {dayList.snack2.foods.map((i, key) => (
                              <li className="dl-li" key={key}>
                                {i}
                              </li>
                            ))}
                             <li className="dl-li">
                                {dayList.snack2.totalCalories} cal
                              </li>
                          </ul>
                        </div>
                      </td>
                      <td className="dl-td">
                        <div className="dl-p">
                          <ul className="p-2 ms-3">
                            {dayList.dinner.foods.map((i, key) => (
                              <li className="dl-li" key={key}>
                                {i}
                              </li>
                            ))}
                             <li className="dl-li">
                                {dayList.dinner.totalCalories} cal
                              </li>
                          </ul>
                        </div>
                      </td>
                      <td rowSpan={2} className="dl-td">

                        <Calories
                          totalcal={
                            dayList.dailyTotalCalories === ""
                              ? 0
                              : dayList.dailyTotalCalories
                          }
                        />
                      </td>
                    </tr>
                    <tr >
                      <td colSpan={6}>
                      <th className="dl-th">
                        Günlük Toplam Kalori Miktarı = {dayList.dailyTotalCalories}
                      </th>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Hr />
      <Quote
        text={`"Yüksek hedeflere sadece yüksek çaba ile ulaşılır."`}
        author={"Jack Ma"}
       />
      <Hr />

      <div className="dl-header">Haftalık Diyet Listesi</div>

      <section className="dl-sec">
        <div className="dl-div">
          <div className="dl-div-two">
            <div className="dl-div-three">
              <div className="dl-div-four">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="dl-th">
                        Günler
                      </th>
                      <th scope="col" className="dl-th">
                        Kahvaltı
                      </th>
                      <th scope="col" className="dl-th">
                        Ara Öğün
                      </th>
                      <th scope="col" className="dl-th">
                        Öğle Yemeği
                      </th>
                      <th scope="col" className="dl-th">
                        Ara Öğün
                      </th>
                      <th scope="col" className="dl-th">
                        Akşam Yemeği
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 ">
                    {daysWeek.map((i, key) => (
                      <tr key={key}>
                        <td className="dl-end align-middle">
                          <p className="dl-day">
                            {gunler[key]}
                          </p>
                          <p className="dl-tr-end">
                            Kalori Mik. = {datalist.days[i].dailyTotalCalories} {" "}
                            cal
                          </p>
                        </td>
                        <td className="dl-end align-top">
                          <div className="dl-p">
                            <ul className="p-2 ms-3">
                              {datalist.days[i].morningMeal.foods.map(
                                (item, key) => (
                                  <li className="dl-li" key={key}>
                                    {item}{" "}
                                  </li>
                                )
                              )}
                              <li className="dl-li">
                                {datalist.days[i].morningMeal.totalCalories}{" "}
                                cal{" "}
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td className="dl-end align-top">
                          <div className="dl-p">
                            <ul className="p-2 ms-3">
                              {datalist.days[i].snack.foods.map((item, key) => (
                                <li className="dl-li" key={key}>
                                  {item}{" "}
                                </li>
                              ))}
                              <li className="dl-li">
                                {datalist.days[i].snack.totalCalories} cal{" "}
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td className="dl-end align-top">
                          <div className="dl-p">
                            <ul className="p-2 ms-3">
                              {datalist.days[i].lunch.foods.map((item, key) => (
                                <li className="dl-li" key={key}>
                                  {item}{" "}
                                </li>
                              ))}
                              <li className="dl-li">
                                {datalist.days[i].lunch.totalCalories} cal{" "}
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td className="dl-end align-top">
                          <div className="dl-p">
                            <ul className="p-2 ms-3">
                              {datalist.days[i].snack2.foods.map(
                                (item, key) => (
                                  <li className="dl-li" key={key}>
                                    {item}{" "}
                                  </li>
                                )
                              )}
                              <li className="dl-li">
                                {datalist.days[i].snack2.totalCalories} cal{" "}
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td className="dl-end align-top">
                          <div className="dl-p">
                            <ul className="p-2 ms-3">
                              {datalist.days[i].dinner.foods.map(
                                (item, key) => (
                                  <li className="dl-li" key={key}>
                                    {item}{" "}
                                  </li>
                                )
                              )}
                              <li className="dl-li">
                                {datalist.days[i].dinner.totalCalories} cal{" "}
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr >
                      <td colSpan={6}>
                      <th className="dl-th">
                        Haftalık Toplam Kalori Miktarı = {datalist.weeklyTotalCalories}
                      </th>
                      </td>
                    </tr>
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

export default UserDietList;
