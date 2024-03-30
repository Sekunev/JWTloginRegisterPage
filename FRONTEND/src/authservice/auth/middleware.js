import { NextResponse } from "next/server";
import { refreshAccsessToken, verifyAccsessToken } from ".";

//! Bu middleware hazırlandı ama kullanılmadı. Sunucu taraflı çalıştığı için uyumsuzluk oluştu. middleware yerine auth klasöründeki diğer dosya içerisindeki fonksiyonlar kullanıldı.

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public sayfaları kontrol etmeden geç
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  // Local Storage'dan access token'ı al
  const accessToken = localStorage.getItem("accessToken");

  // Access token yoksa login sayfasına yönlendir
  if (!accessToken) {
    return NextResponse.redirect("/login");
  }

  // Access token ile kullanıcının bilgilerini al
  try {
    const user = await verifyAccsessToken(accessToken);
  } catch (error) {
    // Access token geçersiz ise refresh token ile yenilemeye çalış
    try {
      const { newAccessToken } = await refreshAccsessToken(
        localStorage.getItem("refreshToken")
      );
      localStorage.setItem("accessToken", newAccessToken);
      const user = await verifyAccsessToken(newAccessToken);
    } catch (error) {
      // Refresh token da geçersiz ise login sayfasına yönlendir
      return NextResponse.redirect("/login");
    }
  }

  // Kullanıcıyı ana sayfaya yönlendir
  return NextResponse.next();
}
