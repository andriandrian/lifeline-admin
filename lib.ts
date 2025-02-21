"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user

  const user = { email: formData.get("email"), name: "John" };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (
    await // Save the session in a cookie
    cookies()
  ).set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  console.log("destroying session");
  (await cookies()).set("token", "", { expires: new Date(0) });
  // (await cookies()).set("refreshToken", "", { expires: new Date(0) });
  (await cookies()).set("email", "", { expires: new Date(0) });
  (await cookies()).set("name", "", { expires: new Date(0) });
  (await cookies()).set("userId", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("token")?.value;

  if (!session) return null;
  if (session) return session;
  // return await decrypt(session)
}

export async function unauthorized() {
  (await cookies()).delete("token");
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("token")?.value;
  if (!session) return NextResponse.next();
  // if (!session) {
  //   return NextResponse.redirect("/login");
  // }
  // Refresh the session so it doesn't expire
  // const parsed = await decrypt(session)
  // parsed.expires = new Date(Date.now() + 10 * 1000)
  const res = NextResponse.next();
  res.cookies.set({
    name: "token",
    // value: await encrypt(parsed),
    value: session,
    // httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // expires: parsed.expires,
  });
  return res;
}
