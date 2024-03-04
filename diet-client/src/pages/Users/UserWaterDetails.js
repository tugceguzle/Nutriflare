import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWater } from "../../api";
import Loading from "../../components/Loading";

const UserWaterDetails = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const {
    isPending,
    error,
    data: waterData,
  } = useQuery({
    queryKey: ["water", userId],
    queryFn: () => fetchWater(userId),
  });

  if (isPending) return <Loading />;

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <button onClick={openModal} className="uwt-btn">
        Detay
      </button>
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
              <span
                className="modal-span"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="modal-div-two">
                <h3
                  className="modal-h-three"
                  id="modal-title"
                >
                  Su Bilgisi
                </h3>
                <div>
                  {isPending && <p>Loading...</p>}
                  {error && <p>An error occurred: {error.message}</p>}
                  {waterData && (
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
                        {waterData.map((item, key) => (
                          <tr key={key}>
                            <td className="users-td">
                              {item.createdAt.split("T")[0]}
                            </td>
                            <td className="users-td">{item.water_ml}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                  <button onClick={closeModal} className="uwt-close">
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
};

export default UserWaterDetails;
