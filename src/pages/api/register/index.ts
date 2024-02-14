import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { app, auth } from "../../../utils/firebase.config";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

console.log("APP", app);
// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("DID REQ", app);
  if (req.method === "POST") {
    const { email, password, displayName } = JSON.parse(req.body);
    console.log(email, password);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        updateProfile(user, { displayName });
        res.status(200).json({ user });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res
          .status(403)
          .json({ message: "NOT FOUND" + errorCode + errorMessage });
        // ..
      });
  }
  // ...
}
