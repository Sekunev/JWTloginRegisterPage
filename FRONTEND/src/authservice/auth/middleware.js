// import { NextResponse } from "next/server";
// import { refreshAccsessToken, verifyAccsessToken } from "./authservice/auth";

// //! Bu middleware hazırlandı ama kullanılmadı. Sunucu taraflı çalıştığı için uyumsuzluk oluştu. middleware yerine auth klasöründeki diğer dosya içerisindeki fonksiyonlar kullanıldı.

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Public sayfaları kontrol etmeden geç
//   if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
//     return NextResponse.next();
//   }

//   // Local Storage'dan access token'ı al
//   const accessToken = localStorage.getItem("accessToken");

//   // Access token yoksa login sayfasına yönlendir
//   if (!accessToken) {
//     return NextResponse.redirect("/login");
//   }

//   // Access token ile kullanıcının bilgilerini al
//   try {
//     const user = await verifyAccsessToken(accessToken);
//   } catch (error) {
//     // Access token geçersiz ise refresh token ile yenilemeye çalış
//     try {
//       const { newAccessToken } = await refreshAccsessToken(
//         localStorage.getItem("refreshToken")
//       );
//       localStorage.setItem("accessToken", newAccessToken);
//       const user = await verifyAccsessToken(newAccessToken);
//     } catch (error) {
//       // Refresh token da geçersiz ise login sayfasına yönlendir
//       return NextResponse.redirect("/login");
//     }
//   }

//   // Kullanıcıyı ana sayfaya yönlendir
//   return NextResponse.next();
// }
import { NextResponse } from "next/server";
import { refreshAccsessToken, verifyAccsessToken } from ".";
import config from "../../config";
import Cookies from "js-cookie";

// export async function middleware(req) {
//   const url = req.nextUrl.clone();
//   url.pathname = `/login`;

//   const { pathname } = req.nextUrl;

//   // Public sayfaları kontrol etmeden geç
//   if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
//     return NextResponse.next();
//   }

//   // Cookie'den access token'ı al
//   const accessToken = req.cookies.get("accessToken")?.value;
//   const refreshToken = req.cookies.get("refreshToken")?.value;

//   // Access token yoksa login sayfasına yönlendir
//   if (!accessToken) {
//     // return NextResponse.redirect(url);
//     // return NextResponse.rewrite(new URL("/login", req.url));
//     // return NextResponse.redirect(new URL("/login", req.url));
//   }
//   //? ahlatlipost@gmail.com
//   //? aA*123456
//   // Access token ile kullanıcının bilgilerini al
//   const user = await verifyAccsessToken(accessToken);
//   if (user) {
//     return NextResponse.next();
//   } else {
//     // Access token geçersiz ise refresh token ile yenilemeye çalış
//     try {
//       const newAccessToken = await refreshAccsessToken(refreshToken);
//       console.log("newAccessToken", newAccessToken);
//       // Yeni access token'ı cookie'ye set et
//       Cookies.set("accessToken", newAccessToken);
//       // NextResponse.next(Cookies.set("accessToken", "newAccessToken}"));
//       const user = await verifyAccsessToken(newAccessToken);
//       console.log("user", user);
//     } catch (error) {
//       // Refresh token da geçersiz ise login sayfasına yönlendir
//       // return NextResponse.redirect(url);
//       console.log(error);
//       return NextResponse.next();
//     }
//   }

//   // Kullanıcıyı ana sayfaya yönlendir
//   // return NextResponse.next();
// }
