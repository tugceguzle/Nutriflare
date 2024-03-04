import React from "react";
import { useAuth } from "../context/AuthContext";
import { ok } from "./ComponentsSvg";

const Footer = () => {
  const { user } = useAuth();
  const currentPath = window.location.pathname;
  return (
    <footer>
      <div className="container px-6 py-12 mx-auto">
        {currentPath !== "/feedback" && user.role === "user" && (
          <>
            <div className="md:flex md:-mx-3 md:items-center md:justify-between">
              <h1 className="text-xl font-semibold tracking-tight text-gray-800 md:mx-3 xl:text-2xl">
                Geri bildiriminizi paylaşabilirsiniz.
              </h1>

              <div className="mt-6 md:mx-3 shrink-0 md:mt-0 md:w-auto">
                <a
                  href="/feedback"
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm text-white duration-300 bg-thorange rounded-lg gap-x-3 hover:bg-thorangelight focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                >
                  <span>Geri Bildirim</span>
                  {ok}
                </a>
              </div>
            </div>

            <hr className="my-6 border-gray-200 md:my-10" />
          </>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-gray-800">Hızlı Linkler</p>
            {user && user.role === "user" ? (
              <div className="flex flex-col items-start mt-5 space-y-2">
                <a href="/home" className="footer-link">
                  Anasayfa
                </a>
                <a href="/dietlist" className="footer-link">
                  Diyet Listesi
                </a>
                <a href="/calories" className="footer-link">
                  Kaloriler
                </a>
                <a href="/recipes" className="footer-link">
                  Tarifler
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-start mt-5 space-y-2">
                <a href="/admin/home" className="footer-link">
                  Anasayfa
                </a>
                <a href="/admin/users" className="footer-link">
                  Danışanlar
                </a>
                <a href="/admin/recipes" className="footer-link">
                  Tarifler
                </a>
              </div>
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-800">Bize Ulaşın</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="footer-link">
                (+90) 555 555 5555
              </a>
              <a href="#" className="footer-link">
                tugce.guzle1928@gmail.com
              </a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-10" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <a href="/" className="font-mono font-black me-12">
            nutriflare
          </a>

          <p className="mt-4 text-sm text-gray-500 sm:mt-0">
            © {new Date().getFullYear()} Your Website. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
