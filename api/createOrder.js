import { db, auth } from "./_utils/firebaseAdmin";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 1. Authenticate the User
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided." });
    }
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Get data from request
    const { amount } = req.body; // e.g., 50000 (for ₹500.00)

    // 3. Create Razorpay Order
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_user_${uid}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 4. Send the order back to the client
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error("Error in /api/createOrder:", error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: "Token expired, please log in again." });
    }
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}