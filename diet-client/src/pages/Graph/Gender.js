import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Rectangle,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchUserAll } from "../../api";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";

function Gender() {
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

  const maleUsers = users.filter(
    (user) => user.gender === "male" && user.role === "user"
  );
  const femaleUsers = users.filter(
    (user) => user.gender === "female" && user.role === "user"
  );

  const totalMaleUsers = maleUsers.length;
  const totalFemaleUsers = femaleUsers.length;

  const data = [
    {
      name: "KIZ",
      mevcut: totalFemaleUsers,
    },
    {
      name: "ERKEK",
      mevcut: totalMaleUsers,
    },
  ];
  return (
    <>
      <ResponsiveContainer width={300} height={300}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="mevcut"
            fill="#8884d8"
            activeBar={<Rectangle fill="#FD841F" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default Gender;
