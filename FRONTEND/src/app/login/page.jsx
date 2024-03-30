"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import GoogleIcon from "../../../public/assest/GoogleIcon";
import TwitterIcon from "../../../public/assest/TwitterIcon";
import { Toaster, toast } from "react-hot-toast";
import config from "../../config";
import { Hide, Show } from "../components/icon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //! email veya password girişi yapılmamışsa toast uyarı mesajı
    if (!email || !password) {
      toast.error("Please fill all fields", {
        position: "top-left",
      });
      return;
    }
    //! ilgili url'e login için istek yap dönen veriyi json'a çevir ve data değişkenine Aktar.
    try {
      const res = await fetch(`${config.API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      //! dönen veride hata yoksa Token'ları localStorage' da sakla
      if (data.error === false) {
        localStorage.setItem("accessToken", data.bearer.accessToken);
        localStorage.setItem("refreshToken", data.bearer.refreshToken);
        toast.success("Logged in successfully", {
          position: "top-left",
        });

        //! state'leri boşalt ve ana sayfaya yönel.
        setEmail("");
        setPassword("");
        router.push("/");
        return;
      }
      toast.error("Invalid Credential", {
        position: "top-left",
      });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-left",
      });
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="py-10 h-[100vh]">
      <div className="px-6 h-full text-gray-800">
        <div className="flex xl:justify-center justify-center items-center flex-wrap h-full gap-4">
          <div className="hidden lg:flex items-center shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-4/12 md:shrink-0  lg:w-4/12 xl:w-4/12 bg-slate-100 h-full">
            <Image
              height={300}
              width={300}
              src="/assest/logo.png"
              className="bg-transparent shadow-sm mx-auto"
              alt="Sample image"
            />
          </div>
          <div className="xl:ml-10 xl:w-6/12 lg:w-6/12 md:w-8/12 mb-12 md:mb-0 max-w-sm">
            <div className="my-6">
              <div className="flex justify-end">
                <div className="w-9 h-9 rounded-full bg-slate-400"></div>
              </div>
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-sm">
                Alrady have an account?{" "}
                <Link href="/register" className="cursor-pointer text-gray-700">
                  Sing Up
                </Link>
              </p>
            </div>
            <button
              className="flex justify-center items-center  border border-gray-500 text-gray-900 text-sm custom-input mt-[15px] rounded-[30px] w-full p-1 font-[600] cursor-pointer"
              type="button"
            >
              <GoogleIcon color="currentColor" className="mr-3" />
              Continue with Google
            </button>
            <button
              className="flex justify-center items-center  border border-gray-500 text-gray-900 text-sm custom-input  mt-[15px] rounded-[30px] w-full  p-1 font-[600] cursor-pointer"
              type="button"
            >
              <TwitterIcon color="currentColor" className="mr-3" />
              Continue with Google
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{ borderBottom: "1px solid #ccc", width: "45%" }}
              ></div>
              <div style={{ padding: "0 10px" }}>or</div>
              <div
                style={{ borderBottom: "1px solid #ccc", width: "45%" }}
              ></div>
            </div>
            <form className="max-w-sm">
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="rachel.kawen@gmail.com"
                  required=""
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required=""
                  name="password"
                  placeholder="******"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {!showPassword ? <Show /> : <Hide />}
                </button>
              </div>
              <div className="text-right">
                <Link
                  href="/login"
                  className="cursor-pointer text-blue-500 text-sm font-[600] "
                >
                  Forgot Password
                </Link>
              </div>
              <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    defaultValue=""
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                    required=""
                  />
                </div>
                <label htmlFor="remember" className="ms-2 text-sm font-medium">
                  Remember me
                </label>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[2rem] text-sm w-full sm:w-[8rem] px-5 py-2.5 text-center "
              >
                Login
              </button>
              <p className="text-sm mt-2">
                Alrady have an account?{" "}
                <Link href="/register" className="cursor-pointer text-gray-700">
                  Sing Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Toaster toastOptions={{ duration: 3000 }} />
    </section>
  );
};

export default Login;
