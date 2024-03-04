import React, { useEffect } from "react";
import { PieChart, Pie } from "recharts";
import { fetchCalories } from "../../api.js";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext.js";
import { calculateCalories } from "./caloriesData.js";
import Loading from "../../components/Loading.js";

function Calories({ totalcal, refresh }) {
  const { user } = useAuth();

  const {
    isPending,
    error,
    data: calorieslist,
    refetch: refetchCalories,
  } = useQuery({
    queryKey: ["calories", user._id],
    queryFn: () => fetchCalories(user._id),
  });
  useEffect(() => {
    if (refresh) {
      refetchCalories();
    }
  }, [refresh, refetchCalories]);

  if (isPending) return <Loading />;

  if (error) return "An error has occurred: " + error.message;

  const { consumedCalories, burnedCalories } = calculateCalories(calorieslist);

  const data = [
    { name: "Dünlük Kalori Miktarı", value: totalcal },
    { name: "Yakılan Ek Kalori Miktarı", value: burnedCalories },
    { name: "Alınan Ek Kalori Miktaro", value: consumedCalories },
  ];

  return (
    <>
      <PieChart width={300} height={250}>
        <Pie
          key={totalcal}
          dataKey="value"
          startAngle={360}
          endAngle={0}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#FD841F"
          label
        ></Pie>
      </PieChart>
    </>
  );
}

export default Calories;
