import React from "react";
import errorImg from "../img/error.png";

export default function NotFound() {
  return (
    <section>
      <div className="nf-sec">
        <div className="wf-ull lg:w-1/2">
          <p className="nf-p">
            404 error
          </p>
          <h1 className="nf-h">
            Page not found
          </h1>
          <p className="mt-4 text-gray-500">
            Sorry, the page you are looking for doesn't exist.Here are some
            helpful links:
          </p>

          <div className="flex items-center mt-6 gap-x-3">
            <button className="footer-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#fff"
                className="w-5 h-5 rtl:rotate-180"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <a className="text-white">Go to home</a>
            </button>
          </div>
        </div>

        <div className="nf-img-div">
          <img className="w-full max-w-lg lg:mx-auto" src={errorImg} alt="" />
        </div>
      </div>
    </section>
  );
}
