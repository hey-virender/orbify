import { NextResponse } from "next/server";
import { verifyToken } from "./utils/tokenUtils";

export async function middleware(req) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;



  // Routes that do not require authentication
  const excludedRoutes = ["/auth", "/verify-email"];
  const isExcludedRoute = excludedRoutes.some((route) => pathname.startsWith(route));

  try {
    // Verify the token
    const decoded = token ? await verifyToken(token) : null;

    if (isExcludedRoute) {
      

      // If the user is already authenticated, redirect them to /dashboard
      if (decoded && pathname !== "/dashboard") {
      
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Allow access to /auth or /verify-email
   
      return NextResponse.next();
    }

    // Handle root route ("/")
    if (pathname === "/") {
      if (!decoded) {
        
        return NextResponse.redirect(new URL("/auth", req.url));
      }

     
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Handle protected routes
    if (!decoded) {
    
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // For authenticated requests, proceed and optionally set user data in cookies
    const response = NextResponse.next();
    response.cookies.set("authUserId", decoded.userId, {
      httpOnly: true,
      secure: true,
    });
    return response;
  } catch (error) {
    
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: [
    "/",               // Root
    "/auth",           // Authentication route
    "/verify-email",   // Email verification route
    "/dashboard",      // Dashboard route
    "/profile",        // Profile route
    "/settings",       // Settings route
  ],
};
