import { adminDb as db } from "../../../firebaseAdmin";

export default async function handler(req, res) {
  const snapshot = await db.collection("users").get();
  const users = [];
  snapshot.forEach((doc) => {
    users.push(doc.data());
  });
  res.status(200).json(users);
}
