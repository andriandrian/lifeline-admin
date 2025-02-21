import { NextRequest } from "next/server";
import { updateSession } from "./lib";

export async function middleware(request: NextRequest) {
  // export async function middleware() {
  return await updateSession(request);
}
