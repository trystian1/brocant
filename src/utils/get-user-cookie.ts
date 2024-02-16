import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "http";
import * as crypto from 'crypto';

export const getUserIdCookie = (
  request?: IncomingMessage,
  response?: ServerResponse<IncomingMessage>,
) => {
  if (!request || !response) {
    console.log("RETURN Null");
    return null;
  }
  const cookies = new Cookies(request, response);
  let user = cookies.get("userid");
  if (!user) {
    user = crypto.randomUUID();
    cookies.set("userid", user);
  }
  console.log("RETURN", user);
  return user;
};
