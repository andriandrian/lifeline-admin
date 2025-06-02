"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>, expirationTime: string) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  const user = { email: formData.get("email"), name: "John" };

  // Create tokens with different expiration times
  const accessToken = await encrypt({ user, type: 'access' }, '15m');
  const refreshToken = await encrypt({ user, type: 'refresh' }, '7d');

  // Set both tokens in cookies
  const cookieStore = await cookies();
  
  cookieStore.set("Authorization", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });
  
  cookieStore.set("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Add a small delay to ensure cookies are set
  await new Promise(resolve => setTimeout(resolve, 300));
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("Authorization");
  cookieStore.delete("RefreshToken");
  cookieStore.delete("name");
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("Authorization")?.value;
    const refreshToken = cookieStore.get("RefreshToken")?.value;

    if (!accessToken && !refreshToken) return null;

    if (accessToken) {
      const decoded = await decrypt(accessToken);
      return decoded;
    }

    if (refreshToken) {
      const decoded = await decrypt(refreshToken);
      const newAccessToken = await encrypt({ user: decoded.user, type: 'access' }, '15m');
      
      cookieStore.set("Authorization", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });

      return decoded;
    }
  } catch (error) {
    return null;
  }
  
  return null;
}

export async function unauthorized() {
  (await cookies()).delete("token");
}

export async function updateSession(request: NextRequest) {
  const accessToken = request.cookies.get("Authorization")?.value;
  const refreshToken = request.cookies.get("RefreshToken")?.value;

  if (!accessToken && !refreshToken) return NextResponse.next();

  try {
    const response = NextResponse.next();
    
    if (accessToken) {
      await decrypt(accessToken); // Verify access token
      return response;
    }

    if (refreshToken) {
      const decoded = await decrypt(refreshToken);
      const newAccessToken = await encrypt({ user: decoded.user, type: 'access' }, '15m');
      
      response.cookies.set({
        name: "Authorization",
        value: newAccessToken,
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });
    }

    return response;
  } catch (error) {
    return Response;
  }
}
