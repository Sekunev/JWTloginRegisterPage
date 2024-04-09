import config from "../../config";
import Cookies from "js-cookie";

//! accessToken ile istek yaparak login olan user'i return eder.
export const verifyAccsessToken = async (accessToken) => {
  try {
    if (accessToken) {
      const res = await fetch(`${config.API_BASE_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await res.json();
      if (data.user) {
        return data.user;
      } else {
        console.log("Kullanıcı login Değil");
      }
    } else {
      console.log("Local Storage'de AccessToken Bulunmuyor.");
    }
  } catch (error) {
    console.log(error);
  }
};

//! Süresi dolan AccessToken için istek yaparak yeni AccessToken üretir. Cookies'a set eder.
export const refreshAccsessToken = async (refreshToken) => {
  try {
    if (refreshToken) {
      const response = await fetch(`${config.API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        //! accessToken ve refreshToken'ı cookie'ye set et
        Cookies.set("accessToken", data.bearer.accessToken);

        console.log("AccessToken Yenilendi");
        return data.bearer.accessToken;
      } else {
        console.log(
          "RefreshToken'in süresi dolmuş. AccessToken yenileme başarısız."
        );
        return false;
      }
    }
  } catch (error) {
    console.error("Token yenileme hatası:", error);
  }
};
