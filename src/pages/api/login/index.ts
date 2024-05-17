import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { app, auth } from "../../../utils/firebase.config";
import Cookies from "cookies";
import { child, get, getDatabase, ref } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object


// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = JSON.parse(req.body);
    

    return signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        console.log('Succes??')
        const user = userCredential.user;
        const cookies = new Cookies(req, res);
        const dbRef = ref(getDatabase(app));
        const snapshot = await get(child(dbRef, `user/${user.uid}`));
        if (snapshot.exists()) {
          //console.log(snapshot.val());
          const snapdata = snapshot.val();
          console.log('DATA', snapdata);
          cookies.set('userid', snapdata.userIdBasket);
          return res.status(200).json({ user });
        } else {
          return res.status(200).json({ user });
        }
        
        
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return res
          .status(403)
          .json({ message: "NOT FOUND" + errorCode + errorMessage });
        // ..
      });
  }
  // ...
}
