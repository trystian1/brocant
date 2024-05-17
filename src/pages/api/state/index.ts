import { NextApiRequest, NextApiResponse } from "next";
import { app, auth } from "../../../utils/firebase.config";
import { child, get, getDatabase, ref } from "firebase/database";
import Cookies from "cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("AUTH", auth.currentUser?.uid);
  if (auth.currentUser) {
    const dbRef = ref(getDatabase(app));
    return get(child(dbRef, `${auth.currentUser.uid}`)).then((snapshot) => {
      console.log(snapshot.exists());
      if (snapshot.exists()) {
        const cookies = new Cookies(req, res);
        const snapdata = snapshot.val();
        const user = {
          displayName: auth.currentUser?.displayName,
          address: snapdata.user.address,
          email: snapdata.user.email,
        };

        cookies.set("userid", snapdata.user.userIdBasket);
        return res.status(200).json({
          user,
        });
      }
    });
  }

  return res.status(200).json({
    user: null,
  });
}
