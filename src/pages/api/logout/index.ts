import { NextApiRequest, NextApiResponse } from "next";
import {
    
    signOut
  } from "firebase/auth";
import { auth } from "@/utils/firebase.config";
import Cookies from "cookies";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    signOut(auth).then(() => {
        cookies.set('userid', null);
        res.json({ status: 200 })
})
}