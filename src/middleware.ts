import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const user = request.cookies.get('userid')?.value
    const response = NextResponse.next();
    
    if (!user) {
        response.cookies.set('userid', crypto.randomUUID())
    }

    return response;
  }