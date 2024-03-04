import React from 'react';
import { loading } from './ComponentsSvg';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        type="button"
        className="bg-thorange text-white py-2 px-4 rounded-full flex items-center"
        disabled
      >
        {loading}
        YÜKLENİYOR...
      </button>
    </div>
  );
};

export default Loading;
