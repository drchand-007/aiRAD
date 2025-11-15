import { db, auth } from "./_utils/firebaseAdmin.js";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 1. Authenticate the User (same as before)
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided." });
    }
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Get payment details from request
    const { order_id, payment_id, signature } = req.body;

    // 3. Verify Razorpay Signature (CRITICAL)
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: "Payment verification failed: Signature mismatch." });
    }

    // 4. SIGNATURE IS VALID! Update user role in Firestore
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      role: "pro",
      lastPaymentId: payment_id,
      // You can also add a subscription expiration date here
    });

    // 5. Send success response
    res.status(200).json({ status: "success", role: "pro" });

  } catch (error) {
    console.error("Error in /api/verifyPayment:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }

}
