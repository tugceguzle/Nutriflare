import React from "react";

function Alert({ description }) {
  return (
    <>
      <div className="px-6 py-4 bg-yellow-50 rounded-lg text-yellow-600 mt-2">
        <span className="font-bold">{description}</span>
      </div>
    </>
  );
}

export default Alert;
