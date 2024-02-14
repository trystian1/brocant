import { NextApiRequest, NextApiResponse } from "next";
import { app, auth } from "../../../utils/firebase.config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("CURRENT", auth.currentUser);
  return res.status(200).json({
    user: auth.currentUser ? auth.currentUser : null,
  });
}
