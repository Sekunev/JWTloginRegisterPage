"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import config from "../config";
import Cookies from "js-cookie";
import { checkAuth } from "@/authservice/auth/withauth";
import { useDispatch, useSelector } from "react-redux";
import { setUser, removeUser } from "../features/authSlice";
const Welcome = () => {
  const [isToken, setIsToken] = useState(true);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const router = useRouter();

  //! logout fonksiyonu ile veri tabanındaki (Simple token  için) token'i sil. JWT kullandığımız için veri tabanındaki token silinmez. Bunun yerine Cookies'deki token bilgisini siliyoruz.
  const logout = async () => {
    try {
      await fetch(`${config.API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(removeUser());
      setIsToken(false);
      toast.success("Logged out successfully", {
        position: "top-left",
      });
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  //! login olan kullanıcı bilgilerini data state'ine Aktar.
  const handleUser = async () => {
    // accessToken'i al
    //! kullanıcıyı kontrol et
    await checkAuth();
    const accessToken = Cookies.get("accessToken");

    try {
      const data = await fetch(`${config.API_BASE_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }).then((response) => response.json());

      //! Kullanıcı Yoksa Login sayfasına yönlendir.

      dispatch(setUser(data.user));
      if (!data.user) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //! sayfa her render edildiğinde handleUser()'ı çalıştırarak login olan kullanıcı bilgilerini data state'ine Aktar.
  useEffect(() => {
    handleUser();
  }, []);

  return (
    <section className="py-10 h-[100vh] flex justify-center items-center flex-col gap-8">
      {user ? (
        <>
          {isToken ? (
            <h1 className="text-3xl font-bold text-center">
              Welcome <span className="text-green-500">{user.username}</span>
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-center text-red-600">
              Goodbye, see you again
            </h1>
          )}
        </>
      ) : (
        <h1 className="text-3xl font-bold text-center text-red-600">
          Please sign in or sign up
        </h1>
      )}

      {user ? (
        <>
          {isToken ? (
            <button
              onClick={logout}
              className="text-white text-center bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[2rem] text-sm w-full sm:w-[8rem] px-5 py-2.5"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-white text-center bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[2rem] text-sm w-full sm:w-[8rem] px-5 py-2.5"
            >
              Login or Register
            </Link>
          )}
        </>
      ) : (
        <Link
          href="/login"
          className="text-white text-center bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[2rem] text-sm w-full sm:w-[8rem] px-5 py-2.5"
        >
          Login or Register
        </Link>
      )}
      <Toaster toastOptions={{ duration: 3000 }} />
    </section>
  );
};

export default Welcome;
