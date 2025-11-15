/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// Initialize Razorpay by securely reading the keys from the config
const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

/**
 * 1. CREATE ORDER FUNCTION
 * Why: A user can't just pay you; they must pay *for something*.
 * This function creates an "order" (an intent to pay) on Razorpay's servers
 * and sends the order_id back to your React app.
 */
exports.createOrder = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const amount = data.amount; // e.g., 50000 (which is ₹500.00)
  const currency = "INR";
  
  const options = {
    amount: amount,
    currency: currency,
    receipt: `receipt_user_${context.auth.uid}_${Date.now()}`,
  };

  try {
    // Talk to Razorpay using our secret key to create the order
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    throw new functions.https.HttpsError("internal", "Could not create Razorpay order.");
  }
});

/**
 * 2. VERIFY PAYMENT FUNCTION
 * Why: This is the most important security step.
 * After the user pays, Razorpay sends a "signature" to your React app.
 * Your app sends that signature here, and this function verifies if it's real.
 * If it's real, we grant the user "pro" access.
 */
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }
  
  const { order_id, payment_id, signature } = data;
  const userId = context.auth.uid;

  // This is the text that Razorpay used to create its signature
  const body = order_id + "|" + payment_id;

  // 1. Verify the signature
  // We re-create the same signature here on our server using our secret key.
  const expectedSignature = crypto
    .createHmac("sha256", functions.config().razorpay.key_secret)
    .update(body.toString())
    .digest("hex");

  // 2. Compare our signature to the one from Razorpay
  if (expectedSignature !== signature) {
    console.warn("Signature mismatch for user:", userId);
    throw new functions.https.HttpsError("invalid-argument", "Payment verification failed.");
  }

  // 3. SIGNATURE IS VALID! The payment is real.
  // Now we can safely update the user's role in our database.
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      role: "pro", // This is the "reward"
      lastPaymentId: payment_id,
      // You can set a real expiration date, e.g., one year from now
    });
    
    return { status: "success", role: "pro" };
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new functions.https.HttpsError("internal", "Payment verified, but failed to update role.");
  }
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
