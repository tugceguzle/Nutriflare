import React, { useState } from "react";

const Dropdown = ({
  dropdownId,
  date,
  formattedCaloriesList,
  burned,
  caldata,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const burnedData =
    formattedCaloriesList &&
    formattedCaloriesList.filter(
      (item) => item.formattedCreatedAt === date && item.caloriesBurned === true
    );
  const consumedData =
    formattedCaloriesList &&
    formattedCaloriesList.filter(
      (item) =>
        item.formattedCreatedAt === date && item.caloriesBurned === false
    );
  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };
  return (
    <>
      <button
        id={`dropdownMenuIconButton-${dropdownId}`}
        onClick={toggleDropdown}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        type="button"
        className="flex items-center w-28 justify-between space-x-2 py-1.5 px-4 transition-colors bg-orange-50 border active:bg-orange-800 font-medium border-orange-50 hover:text-white text-thorange hover:border-thorange rounded-lg hover:bg-thorange disabled:opacity-50 m-auto"
      >
        <div>{isHovered ? "Detay" : `${caldata} cal`}</div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19 9L14 14.1599C13.7429 14.4323 13.4329 14.6493 13.089 14.7976C12.7451 14.9459 12.3745 15.0225 12 15.0225C11.6255 15.0225 11.2549 14.9459 10.9109 14.7976C10.567 14.6493 10.2571 14.4323 10 14.1599L5 9"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke={isHovered ? "#ffffff" : "#FD841F"}
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-50 dark:bg-gray-700">
          <div className="px-1 py-1 text-xs text-thorange rounded-xl dark:bg-gray-800 bg-orange-100/60">
            <ul className="p-2 ms-3 text-left">
              {burned &&
                burnedData.map((i, key) => (
                  <li className="p-1 list-disc text-sm" key={key}>
                    {i.calorie_cal} kcal - {i.description}
                  </li>
                ))}
              {!burned &&
                consumedData.map((i, key) => (
                  <li className="p-1 list-disc text-sm" key={key}>
                    {i.calorie_cal} kcal - {i.description}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Dropdown;
