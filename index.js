const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
let serviceAccount;

serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  console.log("Firebase key loaded successfully");
} catch (err) {
  console.error("Error loading Firebase key:", err);
}

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("AIR-X API running 🚀");
});

// Signup API
app.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received");

    const { email, password, name } = req.body;

    // Create user
    const user = await admin.auth().createUser({
      email,
      password,
    });

    console.log("User created:", user.uid);

    // Save in Firestore
    await db.collection("users").doc(user.uid).set({
      email,
      name,
      role: "student",
      isActive: true,
      createdAt: new Date(),
    });

    console.log("User saved in Firestore");

    res.json({ success: true });

  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
