import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { refreshAccsessToken, verifyAccsessToken } from ".";
import Cookies from "js-cookie";

//! checkAuth kullanıcının oturum açma durumunu kontrol etmek ve gerekirse accessToken ve refreshToken'i güncellemek için kullanılır.

export const checkAuth = async () => {
  //! Cookie'den  tokenları al
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  if (!accessToken) {
    console.log("AccessToken Bulunmuyor");
    // throw new Error("AccessTokenNotFound");
  }

  try {
    const response = await verifyAccsessToken(accessToken);
    console.log("response", response);

    if (response) {
      console.log("AccessToken Aktif");
      return;
    } else {
      console.log("AccessToken'in süresi dolmuş");
      try {
        const refreshResponse = await refreshAccsessToken(refreshToken);
        if (refreshResponse) {
          console.log("RefreshToken Çalıştı. AccessToken'i güncelledi");
          Cookies.set("accessToken", refreshResponse);

          return;
        } else {
          console.log("RefreshToken Çekilemedi veya süresi geçti");

          // throw new Error("RefreshTokenFailed");
        }
      } catch (refreshError) {
        console.log("RefreshToken Çekilemedi veya süresi geçti");
        // throw new Error("RefreshTokenFailed");
      }
    }
  } catch (error) {
    console.log(error);
  }

  // throw new Error("UnknownError");
};

//! withAuth oturum açma durumunu kontrol eder ve uygun şekilde yönlendirme işlemlerini gerçekleştirir.
const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const authCheck = async () => {
        try {
          await checkAuth();
          router.push("/");
        } catch (error) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          router.push("/login");
        }
      };

      authCheck();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
