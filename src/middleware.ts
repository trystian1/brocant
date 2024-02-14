import { NextRequest, NextResponse } from "next/server";
import { auth } from "./utils/firebase.config";
import { getUserIdCookie } from "./utils/get-user-cookie";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  return response;
}
