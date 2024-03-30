import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { refreshAccsessToken, verifyAccsessToken } from ".";

//! checkAuth kullanıcının oturum açma durumunu kontrol etmek ve gerekirse accessToken ve refreshToken'i güncellemek için kullanılır.

const checkAuth = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // console.log("accessToken", accessToken);
  // console.log("refreshToken", refreshToken);

  if (!accessToken) {
    console.log("AccessToken Bulunmuyor");
    throw new Error("AccessTokenNotFound");
  }

  try {
    const response = await verifyAccsessToken(accessToken);

    if (response) {
      console.log("AccessToken Aktif");
      return;
    } else {
      console.log("AccessToken'in süresi dolmuş");
      try {
        const refreshResponse = await refreshAccsessToken(refreshToken);
        if (refreshResponse) {
          console.log("RefreshToken Çalıştı. AccessToken'i güncelledi");
          localStorage.setItem("accessToken", refreshResponse);
          return;
        } else {
          console.log("RefreshToken Çekilemedi veya süresi geçti");
          throw new Error("RefreshTokenFailed");
        }
      } catch (refreshError) {
        console.log("RefreshToken Çekilemedi veya süresi geçti");
        throw new Error("RefreshTokenFailed");
      }
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      //   console.log("Acsess'in süresi dolmuş");
      //   // AccessToken is expired or invalid, try refreshing
      //   try {
      //     const refreshResponse = await refreshAccsessToken(refreshToken);
      //     console.log("refresh token Çalıştı Acsess güncellendi ");
      //     // const refreshResponse = await axios.post('/api/refresh', {
      //     //   refreshToken
      //     // });
      //     localStorage.setItem("accessToken", refreshResponse);
      //     return;
      //   } catch (refreshError) {
      //     console.log("RefreshToken Çekilemedi veya süresi geçti");
      //     throw new Error("RefreshTokenFailed");
      //   }
    }
  }

  throw new Error("UnknownError");
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
          if (
            error.message === "AccessTokenNotFound" ||
            error.message === "UnknownError" ||
            error.message === "RefreshTokenFailed"
          ) {
            // If access token not found or refresh failed or unknown error, redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            router.push("/login");
          }
        }
      };

      authCheck();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
