import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';
import { NextApiRequest, NextApiResponse } from "next";
import { app, auth } from "../../../utils/firebase.config";
import { getUserIdCookie } from "@/utils/get-user-cookie";
import Cookies from "cookies";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "POST") {
    const { email, password, displayName, city, streetName, postalCode } = JSON.parse(req.body);
    console.log(city, streetName, postalCode);
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        updateProfile(user, { displayName });
        const database = getDatabase(app);
        const cookies = new Cookies(req, res);
        let userIdBasket = cookies.get("userid");
      
        set(ref(database, `${user.uid}/user`), { email, displayName, address: { city, streetName, postalCode }, userIdBasket })
          .catch(error => {
    
            return res
            .status(500)
            .json({ message: "BLEH" + error.code + error.message });
          })
          .then(a => console.log('DONE?', a))
        set(ref(database, `${user.uid}/basket`), { id: getUserIdCookie(req, res) })
          .catch(error => {
            return res
            .status(500)
            .json({ message: "BLEH" + error.code + error.message });
          })
        return res.status(200).json({ user });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        return res
          .status(403)
          .json({ message: "NOT FOUND" + errorCode + errorMessage });
        // ..
      });
  }
  // ...
}
