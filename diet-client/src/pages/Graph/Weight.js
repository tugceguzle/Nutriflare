import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchUserAll } from "../../api";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading.js";

function Weight() {
  const {
    isPending,
    error,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserAll,
  });

  if (isPending) return <Loading />;

  if (error) return "An error has occurred: " + error.message;

  const dataa = users.map(
    (user) => user.role === "user" && { x: user.size_cm, y: user.weight_kg }
  );
  return (
    <>
      <ResponsiveContainer width={300} height={300}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="stature" unit="cm" />
          <YAxis type="number" dataKey="y" name="weight" unit="kg" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="A school" data={dataa} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
}

export default Weight;
