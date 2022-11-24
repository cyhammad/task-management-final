import { adminDb as db, adminAuth as auth } from "../../../firebaseAdmin";

async function deleteCollection(db, collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__");

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();
  
    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }
  
    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    const snapshot = await db.collection("users").doc(id).get();
    const user = snapshot.data();
    res.status(200).json(user);
  } else if (req.method === "DELETE") {
    auth.deleteUser(id).then(
        async ()=>{
            await db.collection("users").doc(id).delete();
            await deleteCollection(db, `users/${id}/projects`);
            await deleteCollection(db, `users/${id}/tasks`);
            await deleteCollection(db, `users/${id}/notifications`);
            res.status(200).json({ message: "User deleted successfully" });
        }
    ).catch((error)=>{
        res.status(500).json({ message: error.message });
    });
  }
}
